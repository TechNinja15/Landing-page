# Deployment Runbook

Follow these in order. Each step names exactly what you're checking for
before moving to the next — don't skip the verification lines.

---

## 1. Run the database migrations

**Where:** Supabase Dashboard → your project → SQL Editor

Run these 8 files **in order**, one at a time. Paste the whole file, click
Run, confirm no red error banner, then move to the next.

```
supabase/migrations/0001_extensions_roles_profiles.sql
supabase/migrations/0002_lms_core.sql
supabase/migrations/0003_assignments_certificates_payments.sql
supabase/migrations/0004_crm_content.sql
supabase/migrations/0005_row_level_security.sql
supabase/migrations/0006_seed_data.sql
supabase/migrations/0007_certificate_generation.sql
supabase/migrations/0008_storage_buckets.sql
```

**Verify:** Table Editor → you should see `profiles`, `courses`, `leads`,
`certificates`, etc. (18+ tables). Storage → you should see 6 buckets
(`avatars`, `resumes`, `assignments`, `resources`, `course-notes`,
`certificates`).

**If a file errors:** stop, read the error, fix, re-run *that file only*
(they're written with `if not exists` / `on conflict do nothing` where
possible, so re-running an already-applied file is usually safe).

---

## 2. Create your first admin account

Migrations don't create users — Supabase Auth owns that table directly.

1. Sign up through the app once it's deployed (step 4), or manually via
   Dashboard → Authentication → Users → Add user
2. Then in SQL Editor:
   ```sql
   update public.profiles set role = 'super_admin' where email = 'you@thriveskilltech.com';
   ```
3. **Verify:** log in at `/login` with that account → should land on `/admin`, not `/portal`

---

## 3. Deploy the Edge Function (certificate generation)

**Where:** your terminal, with the Supabase CLI

```bash
npm install -g supabase
supabase login
supabase link --project-ref YOUR-PROJECT-REF   # find this in your project URL
supabase functions deploy generate-certificate
supabase secrets set SITE_URL=https://your-real-domain.com
```

Then in SQL Editor, connect the auto-trigger to your deployed function:

```sql
alter database postgres set app.settings.edge_function_base_url
  = 'https://YOUR-PROJECT-REF.supabase.co/functions/v1';
alter database postgres set app.settings.service_role_key
  = 'YOUR-SERVICE-ROLE-KEY';  -- Settings -> API -> service_role (secret)
```

**Verify:** Dashboard → Edge Functions → `generate-certificate` shows as deployed.
This step can be skipped for now if certificates aren't urgent — nothing
else breaks without it, the admin portal's "Bulk generate" button will
just error with a clear message until this is done.

---

## 4. Deploy the Next.js app (Vercel — fastest path)

The brief specced AWS Amplify; **Amplify deployment config isn't built
yet** (not in this repo). Vercel is a few minutes and requires zero extra
config since this is a stock Next.js 15 App Router project. If AWS is a
hard requirement, say so and that's the next thing to build — Amplify
works fine with this repo too, it just needs an `amplify.yml` and IAM
setup that isn't written yet.

**Steps (Vercel dashboard, no CLI needed):**

1. Push this repo to GitHub (if it isn't already)
2. https://vercel.com → New Project → import that GitHub repo
3. Framework preset: Next.js (auto-detected, leave defaults)
4. **Before clicking Deploy**, add environment variables (below)
5. Deploy

**Environment variables to set** (Vercel → Project → Settings → Environment Variables):

| Variable | Where to get it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Dashboard → Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | same page → `anon` `public` key |
| `SUPABASE_SERVICE_ROLE_KEY` | same page → `service_role` `secret` key — **never** put this in a `NEXT_PUBLIC_` variable |
| `GOOGLE_SHEET_WEBHOOK_URL` | from step 5 below (optional — leads still save to Supabase without it) |

Set each for **Production** (and Preview/Development too if you want
those environments working).

**Verify:** visit the deployed URL → homepage loads with the real brand
colors and course cards, not a build error page.

---

## 5. Point Supabase Auth at your real domain

**Where:** Supabase Dashboard → Authentication → URL Configuration

- **Site URL**: your Vercel domain (e.g. `https://thriveskilltech.vercel.app`
  or your custom domain once attached)
- **Redirect URLs**: add `https://your-domain.com/auth/callback`

**Without this step**, signup confirmation and password reset emails will
redirect to the wrong place and fail. This is the single most common
"auth works locally but not in production" bug.

**Verify:** sign up with a real email on the deployed site → confirmation
email arrives → clicking it lands you back on the site, logged in.

---

## 6. Google Sheets mirror (optional)

Only do this if you actually want leads mirrored into a Sheet in addition
to Supabase — the leads feature works fully without it.

1. Open/create a Google Sheet
2. Extensions → Apps Script → paste in `google-apps-script/appendLead.gs`
3. Deploy → New deployment → type **Web app** → Execute as **Me** → Who has access **Anyone**
4. Copy the URL ending in `/exec`
5. Back in Vercel, set `GOOGLE_SHEET_WEBHOOK_URL` to that URL, redeploy

**Verify:** submit the Book Demo form on the live site → a new row appears
in a "Demo Bookings" tab in your Sheet within a few seconds.

---

## 7. Final smoke test (do all of these on the live URL, not localhost)

- [ ] Homepage loads, dark mode toggle works, course curriculum modals open
- [ ] Book Demo form submits successfully → row appears in Supabase `leads` table (Table Editor)
- [ ] Sign up a test student account → confirmation email → login → lands on `/portal`
- [ ] Log in as your admin account → lands on `/admin`, leads table shows the test submission
- [ ] Edit that lead in the admin CRM → change persists on page refresh
- [ ] Log out, log back in → session persists correctly

If all seven pass, you're live.

---

## What's still not in this repo (so you don't discover it mid-deploy)

- AWS Amplify config (`amplify.yml`, IAM roles) — Vercel works today, Amplify doesn't yet
- Payment processing
- Storage buckets exist and have RLS, but no UI uploads to them yet (avatar upload, resume upload) — the buttons that reference this say so in their toast messages
- CDN/WAF/CloudWatch — Vercel gives you a CDN and basic protections for free; the brief's AWS WAF/CloudWatch specifically aren't replicated
