-- ============================================================
-- 0001_extensions_roles_profiles.sql
-- Thrive Skill Tech — core auth/role scaffolding
-- Safe to run on an existing Supabase project (uses IF NOT EXISTS).
-- ============================================================

create extension if not exists "pgcrypto";

-- ---------- Enums ----------
do $$ begin
  create type public.user_role as enum ('super_admin', 'admin', 'trainer', 'student');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.lead_stage as enum ('new', 'contacted', 'follow_up', 'converted', 'lost');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.enrollment_status as enum ('active', 'completed', 'cancelled');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.attendance_status as enum ('present', 'absent', 'late');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.submission_status as enum ('submitted', 'reviewed', 'resubmit_requested');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.payment_status as enum ('pending', 'paid', 'failed', 'refunded');
exception when duplicate_object then null; end $$;

-- ---------- profiles ----------
-- 1:1 extension of auth.users. Created automatically on signup (trigger below).
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role public.user_role not null default 'student',
  full_name text,
  email text,
  phone text,
  avatar_url text,
  resume_url text,
  linkedin_url text,
  github_url text,
  date_of_birth date,
  notification_preferences jsonb not null default '{"email": true, "whatsapp": false}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is 'One row per auth.users user. Role drives all RLS access.';

-- trainer-specific extension (only populated when role = trainer)
create table if not exists public.trainer_profiles (
  id uuid primary key references public.profiles(id) on delete cascade,
  bio text,
  skills text[] default '{}',
  years_experience int,
  availability text,
  created_at timestamptz not null default now()
);

-- ---------- helper: current user's role (SECURITY DEFINER avoids RLS recursion) ----------
create or replace function public.current_user_role()
returns public.user_role
language sql
security definer
set search_path = public
stable
as $$
  select role from public.profiles where id = auth.uid();
$$;

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select coalesce(public.current_user_role() in ('admin', 'super_admin'), false);
$$;

-- ---------- auto-create profile row on signup ----------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- keep updated_at fresh
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();
