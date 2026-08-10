-- ============================================================
-- 0004_crm_content.sql
-- Lead management, public contact form, admin-editable content
-- ============================================================

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  mobile text not null,
  email text,
  course_interested uuid references public.courses(id),
  source text not null default 'website',   -- website | whatsapp | google_ads | meta_ads | referral | organic
  assigned_counselor uuid references public.profiles(id),
  stage public.lead_stage not null default 'new',
  notes text,
  last_contact_date date,
  next_follow_up_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_leads_stage on public.leads(stage);
create index if not exists idx_leads_counselor on public.leads(assigned_counselor);

drop trigger if exists set_leads_updated_at on public.leads;
create trigger set_leads_updated_at
  before update on public.leads
  for each row execute function public.set_updated_at();

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  subject text,
  message text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  audience text not null default 'all',   -- all | students | trainers | batch
  batch_id uuid references public.batches(id),
  created_by uuid references public.profiles(id),
  published_at timestamptz not null default now()
);

create table if not exists public.resources (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  file_url text not null,
  resource_type text not null default 'pdf',   -- pdf | checklist | template
  is_gated boolean not null default true,       -- true = requires lead capture form
  download_count int not null default 0,
  created_at timestamptz not null default now()
);

-- Admin-editable homepage/site content — hero stats, FAQs, trainer profiles, etc.
-- Stored as jsonb keyed by section, so no code change is needed for routine edits.
create table if not exists public.website_settings (
  key text primary key,
  value jsonb not null,
  updated_by uuid references public.profiles(id),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_website_settings_updated_at on public.website_settings;
create trigger set_website_settings_updated_at
  before update on public.website_settings
  for each row execute function public.set_updated_at();
