-- ============================================================
-- 0007_certificate_generation.sql
-- Storage bucket for certificate PDFs + a trigger that calls the
-- generate-certificate Edge Function automatically when an
-- enrollment's progress_percent reaches 100.
-- ============================================================

-- ---------- Storage bucket ----------
-- Public read (anyone with the link can view/download a certificate —
-- that's the point, it's meant to be shared), writes restricted to
-- the service role only (the Edge Function), never the client directly.
insert into storage.buckets (id, name, public)
values ('certificates', 'certificates', true)
on conflict (id) do nothing;

create policy "certificates_public_read"
  on storage.objects for select
  using (bucket_id = 'certificates');

-- No insert/update/delete policy for authenticated/anon roles is
-- created here deliberately — the bucket is written to exclusively
-- by the Edge Function using the service-role key, which bypasses
-- Storage RLS entirely. Students and admins never upload here directly.

-- ---------- pg_net: lets Postgres make outbound HTTP calls ----------
create extension if not exists pg_net with schema extensions;

-- ---------- trigger function ----------
-- Fires the Edge Function exactly once per enrollment, the moment
-- progress_percent crosses into 100 (not on every update at 100, and
-- not on insert — an enrollment can't start at 100%). The Edge
-- Function itself is also idempotent (checks for an existing
-- certificate before generating), so a duplicate fire is harmless,
-- but this trigger condition keeps it from firing needlessly.
create or replace function public.trigger_certificate_generation()
returns trigger
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  edge_function_url text;
  service_role_key text;
begin
  if NEW.progress_percent = 100 and (OLD.progress_percent is null or OLD.progress_percent < 100) then
    -- These two values must be set once per project via:
    --   alter database postgres set app.settings.edge_function_base_url = 'https://YOUR-PROJECT-REF.supabase.co/functions/v1';
    --   alter database postgres set app.settings.service_role_key = 'YOUR-SERVICE-ROLE-KEY';
    -- Storing the service-role key in a Vault secret instead of a GUC is
    -- the more defensible option for production — see the note at the
    -- bottom of this file.
    edge_function_url := current_setting('app.settings.edge_function_base_url', true);
    service_role_key := current_setting('app.settings.service_role_key', true);

    if edge_function_url is not null and service_role_key is not null then
      perform net.http_post(
        url := edge_function_url || '/generate-certificate',
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', 'Bearer ' || service_role_key
        ),
        body := jsonb_build_object('enrollment_id', NEW.id)
      );
    end if;
    -- If the settings aren't configured yet, this silently no-ops rather
    -- than failing the enrollment update — certificate generation is a
    -- side effect, not something that should ever block a student's
    -- progress from saving. Use the admin portal's "Bulk generate"
    -- button to catch anything this missed once you do configure it.
  end if;
  return NEW;
end;
$$;

drop trigger if exists on_enrollment_completed on public.enrollments;
create trigger on_enrollment_completed
  after update on public.enrollments
  for each row execute function public.trigger_certificate_generation();

-- ============================================================
-- SETUP REQUIRED — this trigger does nothing until you run:
--
--   alter database postgres set app.settings.edge_function_base_url
--     = 'https://YOUR-PROJECT-REF.supabase.co/functions/v1';
--   alter database postgres set app.settings.service_role_key
--     = 'YOUR-SERVICE-ROLE-KEY';
--
-- in the SQL Editor, after deploying the function with:
--   supabase functions deploy generate-certificate
--
-- Storing the service-role key as a plain database setting is
-- workable for a single-tenant project like this one, but it is
-- readable by anyone with SQL access to the database (i.e. any
-- admin). For a stricter setup, use Supabase Vault
-- (https://supabase.com/docs/guides/database/vault) instead and
-- reference the secret by name rather than storing it in a GUC.
-- ============================================================
