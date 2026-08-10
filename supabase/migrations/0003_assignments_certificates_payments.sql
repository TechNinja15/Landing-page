-- ============================================================
-- 0003_assignments_certificates_payments.sql
-- ============================================================

create table if not exists public.assignments (
  id uuid primary key default gen_random_uuid(),
  module_id uuid references public.modules(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  title text not null,
  instructions text,
  due_date timestamptz,
  max_score int not null default 100,
  created_at timestamptz not null default now()
);

create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  assignment_id uuid not null references public.assignments(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  file_url text,
  github_url text,
  drive_url text,
  status public.submission_status not null default 'submitted',
  feedback text,
  score int,
  submitted_at timestamptz not null default now(),
  reviewed_at timestamptz,
  unique (assignment_id, student_id)
);

create table if not exists public.certificates (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  certificate_number text unique not null,   -- e.g. TST-2026-000123
  pdf_url text,
  issued_at timestamptz not null default now(),
  unique (student_id, course_id)
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  course_id uuid references public.courses(id),
  amount numeric(10,2) not null,
  currency text not null default 'INR',
  status public.payment_status not null default 'pending',
  payment_method text,                 -- razorpay | stripe | manual | bank_transfer
  transaction_ref text,
  paid_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists idx_assignments_course on public.assignments(course_id);
create index if not exists idx_submissions_assignment on public.submissions(assignment_id);
create index if not exists idx_submissions_student on public.submissions(student_id);
create index if not exists idx_certificates_student on public.certificates(student_id);
create index if not exists idx_payments_student on public.payments(student_id);

-- ---------- public certificate verification ----------
-- Exposes only what's needed to verify a certificate (no full table access).
create or replace function public.verify_certificate(cert_number text)
returns table (
  student_name text,
  course_title text,
  issued_at timestamptz,
  is_valid boolean
)
language sql
security definer
set search_path = public
stable
as $$
  select p.full_name, c.title, cert.issued_at, true
  from public.certificates cert
  join public.profiles p on p.id = cert.student_id
  join public.courses c on c.id = cert.course_id
  where cert.certificate_number = cert_number;
$$;

grant execute on function public.verify_certificate(text) to anon, authenticated;
