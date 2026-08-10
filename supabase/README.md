# Thrive Skill Tech — Supabase schema

Since your Supabase project already exists, these are **migrations to run
against it**, not a fresh setup. Nothing here creates a new project.

## What's in here

| File | Contains |
|---|---|
| `0001_extensions_roles_profiles.sql` | `user_role` enum, `profiles` table, auto-create-profile-on-signup trigger, `current_user_role()` / `is_admin()` helpers |
| `0002_lms_core.sql` | courses, modules, lessons, batches, enrollments, lesson_progress (resume playback), live_classes, attendance |
| `0003_assignments_certificates_payments.sql` | assignments, submissions, certificates (+ public verification function), payments |
| `0004_crm_content.sql` | leads (mini CRM), contact_messages, announcements, resources, website_settings (admin-editable content) |
| `0005_row_level_security.sql` | RLS policies for every table above |
| `0006_seed_data.sql` | the 3 real courses with real modules pulled from your curriculum docs; **no fake stats or testimonials** |
| `0007_certificate_generation.sql` | `certificates` storage bucket + a trigger that auto-calls the `generate-certificate` Edge Function when an enrollment hits 100% |

## How to apply

**Option A — Supabase Dashboard (fastest, no CLI setup)**
1. Open your project → SQL Editor
2. Paste and run each file **in order**, 0001 → 0006
3. Check Table Editor to confirm all tables appeared

**Option B — Supabase CLI (recommended once you're iterating regularly)**
```bash
npx supabase login
npx supabase link --project-ref YOUR-PROJECT-REF
# copy these 6 files into your local supabase/migrations/ folder, then:
npx supabase db push
```

## After running the migrations

1. **Sign up your own account** through the app (or Supabase Auth dashboard) once — this fires the trigger that creates your `profiles` row with `role = 'student'` by default.
2. **Promote yourself to super_admin**, run once in the SQL Editor:
   ```sql
   update public.profiles set role = 'super_admin' where email = 'you@thriveskilltech.com';
   ```
3. Add your Supabase URL/keys to `.env.local` using `.env.example` as the template.
4. Install the client libs in your Next.js app:
   ```bash
   npm install @supabase/ssr @supabase/supabase-js
   ```
5. Deploy the certificate-generation Edge Function and wire up the trigger:
   ```bash
   supabase functions deploy generate-certificate
   supabase secrets set SITE_URL=https://thriveskilltech.com
   ```
   Then in the SQL Editor, connect the trigger to your deployed function
   (see the comment block at the bottom of `0007_certificate_generation.sql`
   for the exact two `alter database` statements — they need your real
   project ref and service-role key, which is why they're not baked into
   the migration itself).

## Design notes worth knowing

- **RLS is default-deny.** Every table has RLS enabled; if a query returns
  nothing unexpected, check the policy before assuming a bug.
- **Leads and contact messages are public-insert, staff-only-read.** This is
  what lets the landing page's lead-magnet form and contact form write
  directly from the browser with the anon key, safely.
- **Certificate verification is a public RPC**, not a public table. Call
  `supabase.rpc('verify_certificate', { cert_number })` from the certificate
  verification page — it returns only name/course/date, never the full row.
- **`website_settings` is a jsonb key-value store** so admins can edit hero
  copy, stats, and FAQs without a schema change or deploy. The landing page
  build I gave you shows placeholders (`—`) for stats for exactly this
  reason — wire it to read `hero_stats` from this table once populated.
- **Storage buckets aren't created by SQL.** In the Dashboard, create buckets
  for: `avatars`, `resumes`, `assignments`, `certificates`, `resources`,
  `course-notes` — each with appropriate public/private access and a
  Storage RLS policy mirroring the table policies above.
