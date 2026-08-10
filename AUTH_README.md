# Auth pages

Five routes that complete the login loop `middleware.ts` already expects:

| Route | Purpose |
|---|---|
| `/login` | Email/password sign-in, redirects by role (admin → `/admin`, student/trainer → `/portal`) |
| `/signup` | Creates the account; a DB trigger (0001 migration) auto-creates the `profiles` row |
| `/forgot-password` | Sends a reset email — always shows the same success message so it doesn't leak which emails have accounts |
| `/reset-password` | Sets a new password once the user arrives via the reset link |
| `/auth/callback` | Server route every Supabase auth email points to first; exchanges the link's `code` for a real session, then forwards the user on |
| `/auth/signout` | POST-only route to clear the session |

## Required Supabase dashboard settings

These pages assume your project's **Authentication → URL Configuration** has:

- **Site URL** set to your production domain (or `http://localhost:3000` in dev)
- **Redirect URLs** including `{your-domain}/auth/callback` — without this,
  Supabase will refuse to redirect back to `/auth/callback` and the
  confirmation/reset links will fail with a redirect error.

Also check **Authentication → Providers → Email**:
- "Confirm email" should stay **on** for production (the signup page's
  "check your inbox" flow assumes this). Turn it off only for quick local
  testing if you want new accounts active immediately.

## Why the role redirect logic is duplicated in three places

`/login`, `/auth/callback`, and `middleware.ts` (from the earlier Supabase
delivery) each independently look up `profiles.role` and decide between
`/admin` and `/portal`. This is intentional, not copy-paste debt — each one
runs at a different point in the flow (post-password-login,
post-magic-link, and every subsequent page load) and none of them can
assume the others already ran. If you want a single source of truth,
extract it into `lib/auth/get-redirect-path.ts` and import it in all three.

## What's not built here

- OAuth providers (Google/etc.) — the brief only asked for email/password
  and optional magic link, so those aren't wired. Supabase supports both;
  adding a "Continue with Google" button is a few lines in `/login` once
  you've enabled the provider in the dashboard.
- Rate limiting on login attempts — Supabase Auth has its own built-in
  rate limits server-side, but nothing app-level here. Fine to start; worth
  revisiting with Cloudflare Turnstile per the brief's SECURITY section
  before real traffic.
