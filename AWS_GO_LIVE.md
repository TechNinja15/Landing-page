# Complete Go-Live Guide (AWS)

One sequential path from an empty Supabase project to a live site at
thriveskilltech.com on AWS Amplify. Do these in order — later steps
depend on earlier ones. Each step has a **Verify** line — don't move on
until it passes.

Prerequisites: AWS CLI installed and configured (`aws configure`) with
an account that has permissions for Amplify, CloudFormation, Route 53,
WAF, and SNS. A Supabase project already created.

---

## PART A — Supabase (do this first, everything else depends on it)

### A1. Run the 8 migrations
Supabase Dashboard → SQL Editor → paste + run each file, in order:
```
0001_extensions_roles_profiles.sql
0002_lms_core.sql
0003_assignments_certificates_payments.sql
0004_crm_content.sql
0005_row_level_security.sql
0006_seed_data.sql
0007_certificate_generation.sql
0008_storage_buckets.sql
```
**Verify:** Table Editor shows 18+ tables. Storage shows 6 buckets.

### A2. Create your admin account
Sign up once via the app (you'll deploy it in Part B — you can also
come back and do this step after Part B if you prefer). Then:
```sql
update public.profiles set role = 'super_admin' where email = 'you@thriveskilltech.com';
```
**Verify:** logging in redirects to `/admin`, not `/portal`.

### A3. Deploy the certificate Edge Function
```bash
npm install -g supabase
supabase login
supabase link --project-ref YOUR-PROJECT-REF
supabase functions deploy generate-certificate
supabase secrets set SITE_URL=https://thriveskilltech.com
```
Then in SQL Editor:
```sql
alter database postgres set app.settings.edge_function_base_url
  = 'https://YOUR-PROJECT-REF.supabase.co/functions/v1';
alter database postgres set app.settings.service_role_key
  = 'YOUR-SERVICE-ROLE-KEY';
```
**Verify:** Dashboard → Edge Functions shows `generate-certificate` as deployed.
(Skippable for now — nothing else breaks without it.)

---

## PART B — AWS Amplify Hosting

### B1. One-time GitHub authorization
AWS Console → Amplify → **New app** → **Host web app** → GitHub → complete
the OAuth prompt to install the AWS Amplify GitHub App on your repo →
close the wizard without finishing it.
**Verify:** no direct check — this just unlocks B3 below. If B3's stack
deploy fails with a repository access error, this step didn't take.

### B2. Point GoDaddy's nameservers at Route 53
```bash
aws route53 create-hosted-zone \
  --name thriveskilltech.com \
  --caller-reference thrive-skill-tech-$(date +%s)
```
Copy the 4 nameservers from the response. GoDaddy → your domain → **DNS**
→ **Nameservers** → **Change** → **Enter my own nameservers (advanced)**
→ paste the 4 AWS nameservers → Save.
**Verify:** `dig NS thriveskilltech.com` shows the AWS nameservers (can
take up to 24-48h — GoDaddy's TTL controls this, not AWS).

### B3. Deploy the Amplify app
```bash
aws cloudformation deploy \
  --template-file infrastructure/aws/amplify-app.template.yml \
  --stack-name thrive-skill-tech-app \
  --parameter-overrides \
      RepositoryUrl=https://github.com/your-org/thrive-skill-tech \
      NextPublicSupabaseUrl=https://YOUR-PROJECT-REF.supabase.co \
      NextPublicSupabaseAnonKey=YOUR_ANON_KEY \
      CustomDomainName=thriveskilltech.com \
  --capabilities CAPABILITY_IAM
```
**Verify:**
```bash
aws cloudformation describe-stacks --stack-name thrive-skill-tech-app --query "Stacks[0].Outputs"
```
Visit the `DefaultDomain` output URL — site should build and load within
a few minutes (watch progress: Amplify Console → your app → branch build log).

### B4. Set the service-role key (do this in console, not CloudFormation)
Amplify Console → your app → **App settings → Environment variables** →
add `SUPABASE_SERVICE_ROLE_KEY` with the secret value from Supabase
Dashboard → Settings → API. Redeploy the branch for it to take effect
(Amplify Console → your branch → **Redeploy this version**).
**Verify:** submit the Book Demo form on the live site → row appears in
Supabase `leads` table.

### B5. Confirm the custom domain
Once B2's DNS has propagated, Amplify auto-detects the Route 53 zone and
verifies the domain — no manual CNAME needed.
**Verify:** Amplify Console → Domain management → `thriveskilltech.com`
shows "Available" (not "Pending verification"). Visit
`https://thriveskilltech.com` directly.

### B6. Point Supabase Auth at the real domain
Supabase Dashboard → Authentication → URL Configuration:
- **Site URL**: `https://thriveskilltech.com`
- **Redirect URLs**: add `https://thriveskilltech.com/auth/callback`
**Verify:** sign up with a real email on the live site → confirmation
email link lands you back on the site, logged in. (Skipping this step
is the most common "auth works locally, breaks in production" bug.)

---

## PART C — Security & alerting (optional but recommended)

### C1. Build-failure alerts
```bash
aws cloudformation deploy \
  --template-file infrastructure/aws/build-notifications.template.yml \
  --stack-name thrive-skill-tech-alerts \
  --parameter-overrides \
      AmplifyAppId=<AmplifyAppId output from B3> \
      AlertEmail=you@thriveskilltech.com
```
**Verify:** check that inbox, click "Confirm subscription" on the SNS email.

### C2. WAF (must be us-east-1)
```bash
aws cloudformation deploy \
  --template-file infrastructure/aws/waf-webacl.template.yml \
  --stack-name thrive-skill-tech-waf \
  --region us-east-1
```
Then manually: AWS Console → **WAF & Shield** → Web ACLs →
`thrive-skill-tech-web-acl` → **Associated AWS resources** → Add AWS
resources → CloudFront distributions → select the one tagged with your
Amplify App ID (find it via CloudFront Console, search for your
`*.amplifyapp.com` alias).
**Verify:** WAF Console shows request sampling once traffic hits the
site; a rapid burst of requests at `/api/leads` from one IP should get blocked.

### C3. Google Sheets lead mirror (optional)
1. Open a Google Sheet → Extensions → Apps Script → paste
   `google-apps-script/appendLead.gs`
2. Deploy → New deployment → Web app → Execute as **Me** → Access **Anyone**
3. Copy the `/exec` URL → Amplify Console → Environment variables →
   `GOOGLE_SHEET_WEBHOOK_URL` → redeploy
**Verify:** submit Book Demo form → row appears in the Sheet within seconds.

---

## PART D — Final smoke test (on the live domain, not localhost)

- [ ] Homepage loads at `https://thriveskilltech.com`, dark mode toggle works
- [ ] Book Demo form submits → row in Supabase `leads` table
- [ ] Sign up a test student → confirmation email → login → lands on `/portal`
- [ ] Log in as admin → lands on `/admin`, sees the test lead
- [ ] Edit that lead in the CRM → change persists on refresh
- [ ] Log out, log back in → session persists
- [ ] A student certificate generates on 100% progress, or "Bulk generate" works from admin

All seven passing = you're live.

---

## If something breaks

Bring back the exact error message (CloudFormation stack event, Amplify
build log line, or browser console error) rather than "it didn't work" —
each of these steps has a specific, debuggable failure mode and I can
fix it directly against the real error instead of guessing.
