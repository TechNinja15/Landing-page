# AWS Deployment (Amplify Hosting)

Three CloudFormation templates + one manual GitHub authorization. Deploy
in this order — later templates depend on outputs from earlier ones.

## Why this isn't 100% CloudFormation

Two things in AWS's Amplify + WAF stack genuinely cannot be automated
away, regardless of tooling — noted here so you're not searching for a
CFN property that doesn't exist:

1. **Connecting GitHub the first time** requires installing the "AWS
   Amplify" GitHub App via OAuth in the console. This is a GitHub-side
   authorization, not an AWS API call — there's no CloudFormation
   resource for it. One-time per AWS account/region.
2. **Attaching a WAF Web ACL to the Amplify app's CloudFront
   distribution** requires the console, because Amplify Hosting manages
   that CloudFront distribution internally and doesn't expose it as an
   editable CloudFormation resource you can reference.

Everything else here is real infrastructure-as-code.

---

## 0. One-time GitHub authorization (console, ~2 minutes)

AWS Console → Amplify → **New app** → **Host web app** → GitHub → follow
the OAuth prompt to install the AWS Amplify GitHub App on your repo or
org → then just close the wizard without finishing it. This step alone
is what unlocks step 1 below.

## 1. Deploy the Amplify app

```bash
aws cloudformation deploy \
  --template-file amplify-app.template.yml \
  --stack-name thrive-skill-tech-app \
  --parameter-overrides \
      RepositoryUrl=https://github.com/your-org/thrive-skill-tech \
      NextPublicSupabaseUrl=https://YOUR-PROJECT-REF.supabase.co \
      NextPublicSupabaseAnonKey=YOUR_ANON_KEY \
      CustomDomainName=thriveskilltech.com \
  --capabilities CAPABILITY_IAM
```

Leave `SupabaseServiceRoleKey` unset here (see the parameter's
description in the template for why) and instead set it directly:
Amplify Console → your app → **App settings → Environment variables**
→ add `SUPABASE_SERVICE_ROLE_KEY`.

**Verify:** `aws cloudformation describe-stacks --stack-name
thrive-skill-tech-app --query "Stacks[0].Outputs"` → visit
`DefaultDomain` → site should build and load within a few minutes
(watch progress in Amplify Console → your app → the branch's build log).

## 2. Build-failure alerts (fully automated, no manual step)

```bash
aws cloudformation deploy \
  --template-file build-notifications.template.yml \
  --stack-name thrive-skill-tech-alerts \
  --parameter-overrides \
      AmplifyAppId=<AmplifyAppId output from step 1> \
      AlertEmail=you@thriveskilltech.com
```

**Verify:** check that inbox for an SNS "Subscription Confirmation"
email and click confirm — alerts stay silent until you do.

## 3. WAF Web ACL (must be us-east-1)

```bash
aws cloudformation deploy \
  --template-file waf-webacl.template.yml \
  --stack-name thrive-skill-tech-waf \
  --region us-east-1
```

Then the one unavoidably manual step: **AWS Console → WAF & Shield →
Web ACLs → thrive-skill-tech-web-acl → Associated AWS resources → Add
AWS resources → CloudFront distributions** → select the one Amplify
created for this app (find it in CloudFront Console by searching for
your `*.amplifyapp.com` alias, or match it against the `AmplifyAppId`
from step 1's outputs — Amplify tags its distributions with the App ID).

**Verify:** WAF Console → the Web ACL's dashboard shows request sampling
once traffic hits the site; try a rapid burst of requests against
`/api/leads` from one IP to confirm the rate-limit rule engages.

---

## Domain setup (thriveskilltech.com, registered at GoDaddy)

GoDaddy doesn't support ANAME/ALIAS records on a root domain, which
matters because a root domain can't just CNAME to Amplify's CloudFront
target the way a subdomain can. Since nothing else (email, other
subdomains) depends on GoDaddy's DNS for this domain, the clean fix is
moving **DNS management** to Route 53 — this does **not** transfer
domain registration or ownership away from GoDaddy, it just changes
which nameservers answer DNS queries.

**1. Create a Route 53 hosted zone**

```bash
aws route53 create-hosted-zone \
  --name thriveskilltech.com \
  --caller-reference thrive-skill-tech-$(date +%s)
```

Note the 4 nameservers in the response's `DelegationSet.NameServers`
(or fetch them anytime: `aws route53 get-hosted-zone --id <ZONE_ID>`).

**2. Point GoDaddy at those nameservers**

GoDaddy → your domain → **DNS** → **Nameservers** → **Change** →
**Enter my own nameservers (advanced)** → paste in the 4 Route 53
nameservers, replacing GoDaddy's defaults. Save.

**Verify:** `dig NS thriveskilltech.com` — should return the 4 AWS
nameservers once propagated (usually under a few hours, can take up to
24-48h; GoDaddy's DNS TTL determines this, not AWS).

**3. Deploy the Amplify app with the domain parameter**

Once propagation is confirmed, run step 1 from above (or re-run it)
with `CustomDomainName=thriveskilltech.com`. Because the Route 53
hosted zone now exists and is in the same AWS account, Amplify's
`AWS::Amplify::Domain` resource verifies ownership and creates the
needed records automatically — no manual CNAME entry required, unlike
the GoDaddy-DNS path.

**Verify:** Amplify Console → your app → Domain management →
`thriveskilltech.com` should move from "Pending verification" to
"Available" — typically 15-30 minutes after the CFN stack deploys, once
DNS has propagated.

**If you'd rather not touch nameservers:** it's possible to stay on
GoDaddy DNS entirely, but only by making `www.thriveskilltech.com` the
canonical URL (CNAME works fine on a subdomain) and using GoDaddy's
**Domain Forwarding** feature to redirect the bare root domain to
`https://www.thriveskilltech.com`. Say the word if you want those exact
manual CNAME values instead — they only become known after the domain
is added in Amplify Console, since AWS generates them per-app.



Each template is its own stack — `aws cloudformation delete-stack
--stack-name <name>` removes that piece independently. Deleting the
Amplify app stack removes the hosted site; it does not touch Supabase.

## What this doesn't cover

CloudWatch alarms here are scoped to *build* failures only (something
Amplify can report on directly via EventBridge). Runtime alarms — 5xx
error rate, latency, WAF block-rate thresholds — would need to target
the CloudFront distribution's own CloudWatch metrics, which hits the
same "distribution isn't a first-class CFN resource here" limitation as
the WAF association above. Buildable, but it's a console/CLI step
(CloudWatch Console → Alarms → find the distribution's metrics
namespace) rather than something this template set can do for you.
