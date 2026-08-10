# Thrive Skill Tech

AI-first EdTech platform for Thrive Skill Tech — marketing site, student
portal, admin CRM, and the Supabase backend behind all three.

## What's actually here vs. what's described elsewhere

This repo is real, runnable Next.js code for the pieces that were built:
landing page, student portal, admin portal, auth, Supabase schema/RLS, and
a lead-capture API with a Google Sheets mirror. It is **not** the full
scope of the original brief (AWS deployment, 3D hero, payments, testing
suite, CI/CD, native apps, etc.) — those remain open, listed honestly at
the bottom of this file rather than stubbed out with fake placeholders.

## Stack

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS · Supabase
(Postgres, Auth, RLS) · lucide-react · recharts

## Quick start

```bash
npm install
cp .env.example .env.local
# fill in NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY,
# SUPABASE_SERVICE_ROLE_KEY from your existing Supabase project's
# Settings -> API page

npm run dev
```

Before the app will do anything useful, run the database migrations —
see `supabase/README.md` for exact steps (SQL editor or CLI, your choice).
Then read `AUTH_README.md` for the two Supabase dashboard settings the
auth pages depend on (redirect URLs, email confirmation).

## Project structure

```
app/
  page.tsx                 → marketing landing page
  portal/page.tsx           → student portal (auth-gated)
  admin/page.tsx             → admin portal (auth + role-gated)
  login/, signup/,
  forgot-password/,
  reset-password/            → auth pages
  auth/callback/route.ts     → exchanges Supabase email-link codes for sessions
  auth/signout/route.ts
  api/leads/route.ts          → backend for every lead-capturing form on the site

components/
  landing/ThriveSkillTechLanding.jsx
  portal/StudentPortal.jsx
  admin/AdminPortal.jsx
  auth/AuthShell.tsx          → shared layout for the 4 auth pages

lib/supabase/                → browser + server Supabase clients
supabase/migrations/          → 6 SQL files: schema, RLS, seed data
google-apps-script/           → optional Sheets mirror for /api/leads
types/database.ts             → hand-written types (until you run `npm run db:types`)
middleware.ts                 → session refresh + role-gated route protection
```

## Why `components/*.jsx` instead of `.tsx`

The three big UI components (landing, student portal, admin portal) were
built and iterated on as standalone preview files before this project
skeleton existed, and they're untyped. Renamed to `.jsx` rather than
`.tsx` deliberately — the `tsconfig.json` here has `strict: true`, which
would fail on every untyped function parameter in those files
(`noImplicitAny`). `allowJs: true` lets Next.js build them fine as-is
without forcing a type-annotation pass first. Worth doing that pass
eventually, just not required to ship.

## How data flows into the portals

`app/portal/page.tsx` and `app/admin/page.tsx` are Server Components —
they fetch everything up front (`lib/data/student.ts`, `lib/data/admin.ts`)
using the user's own session, so RLS applies exactly as it would to any
authenticated request, and pass it down as an `initialData` prop.

Interactive mutations (editing a lead, submitting an assignment, saving
a profile) happen client-side inside `StudentPortal.jsx`/`AdminPortal.jsx`
via the browser Supabase client — also subject to RLS, just running after
the page has already rendered. This is a deliberate split: expensive,
multi-table reads happen once on the server; cheap, single-row writes
happen client-side without a full page reload.

One consequence worth knowing: these two files don't re-fetch after a
mutation, they update local React state optimistically. Navigating away
and back re-runs the Server Component and pulls fresh data, but staying
on the same screen after, say, editing a lead, trusts the client-side
update rather than confirming against the database. Fine for a first
pass; swap for `router.refresh()` after mutations if that assumption
ever bites.

## What's genuinely working end-to-end right now

- Sign up → email confirmation → login → role-based redirect → portal/admin
- Book Demo form / resources form → `/api/leads` → Supabase `leads` table
  + optional Google Sheets mirror
- Student portal reads real enrollments, live classes, assignments,
  certificates, and course/module progress from Supabase; assignment
  submission and profile edits write back for real
- Admin portal reads real leads, students (via enrollments), courses,
  batches, and payments; lead create/edit/delete and website content
  edits write back for real through RLS-respecting browser-client calls
- Certificate generation: a real PDF with an embedded QR code, generated
  by `supabase/functions/generate-certificate`, triggered automatically
  when an enrollment hits 100% (or manually via the admin portal's "Bulk
  generate" button) — uploaded to Storage and verifiable via the public
  `verify_certificate()` RPC
- `/verify/[certificate_number]` — the page every certificate's QR code
  actually points to; confirms authenticity or clearly says "not found",
  with `/verify` as a manual-lookup fallback for damaged QR scans
- RLS policies enforced on every table
- Password reset flow
- AWS Amplify Hosting as real infrastructure-as-code: `infrastructure/aws/`
  has CloudFormation templates for the Amplify app itself, a WAF Web ACL
  with managed rule groups + rate limiting, and CloudWatch build-failure
  alerting via SNS — see `infrastructure/aws/README.md` for the exact
  deploy order and the two steps AWS makes unavoidably manual (GitHub
  authorization, and attaching WAF to Amplify's internally-managed
  CloudFront distribution)

## What's not built (honest list)

- Payments (Razorpay/Stripe)
- Runtime CloudWatch alarms (5xx rate, latency) on the Amplify app's
  CloudFront distribution — build-failure alerts are automated (see
  above), but distribution-level metrics hit the same "not a first-class
  CFN resource" limitation as the WAF association; documented as a
  console step in `infrastructure/aws/README.md`
- 3D hero (Three.js/R3F) — the landing page uses a 2D SVG signature
  element instead; see the first delivery in this thread for the reasoning
- HubSpot/Calendly/Zoom/SES integrations
- Testing suite, CI/CD pipeline
- Storage buckets other than `certificates` (avatars, resumes, assignments,
  resources, course-notes are still a manual dashboard step — see
  `supabase/README.md`)
- Course/module/lesson content management UI in the admin portal ("Edit
  curriculum" and "New course" currently just notify — no builder yet)
- Search in both portals is wired to show a real result/no-result toast
  but doesn't navigate to a detail view yet
