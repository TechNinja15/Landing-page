-- ============================================================
-- 0002_lms_core.sql
-- Courses, curriculum structure, batches, enrollments, progress
-- ============================================================

create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  tagline text,
  summary text,
  level text,
  duration_label text,          -- e.g. "10–12 Weeks"
  mode text,                    -- e.g. "Live Online / Hybrid"
  price numeric(10,2),
  currency text not null default 'INR',
  image_url text,
  accent_color text,
  certificate_enabled boolean not null default true,
  is_published boolean not null default false,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.modules (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  title text not null,
  order_index int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references public.modules(id) on delete cascade,
  title text not null,
  video_url text,               -- unlisted YouTube embed
  notes_url text,                -- Supabase Storage PDF path
  duration_minutes int,
  order_index int not null default 0,
  is_free_preview boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.batches (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  name text not null,
  trainer_id uuid references public.profiles(id),
  start_date date,
  end_date date,
  timing text,                  -- e.g. "Mon/Wed/Fri 7–9 PM IST"
  capacity int,
  status text not null default 'upcoming', -- upcoming | active | completed
  created_at timestamptz not null default now()
);

create table if not exists public.enrollments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  batch_id uuid references public.batches(id),
  status public.enrollment_status not null default 'active',
  progress_percent int not null default 0 check (progress_percent between 0 and 100),
  enrolled_at timestamptz not null default now(),
  completed_at timestamptz,
  unique (student_id, course_id)
);

create table if not exists public.lesson_progress (
  id uuid primary key default gen_random_uuid(),
  enrollment_id uuid not null references public.enrollments(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  completed boolean not null default false,
  bookmarked boolean not null default false,
  last_position_seconds int not null default 0,   -- resume-where-you-left-off
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  unique (enrollment_id, lesson_id)
);

create table if not exists public.live_classes (
  id uuid primary key default gen_random_uuid(),
  batch_id uuid not null references public.batches(id) on delete cascade,
  title text not null,
  scheduled_at timestamptz not null,
  duration_minutes int not null default 60,
  zoom_link text,
  recording_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.attendance (
  id uuid primary key default gen_random_uuid(),
  live_class_id uuid not null references public.live_classes(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  status public.attendance_status not null default 'absent',
  marked_at timestamptz not null default now(),
  unique (live_class_id, student_id)
);

-- ---------- indexes ----------
create index if not exists idx_modules_course on public.modules(course_id);
create index if not exists idx_lessons_module on public.lessons(module_id);
create index if not exists idx_batches_course on public.batches(course_id);
create index if not exists idx_enrollments_student on public.enrollments(student_id);
create index if not exists idx_enrollments_course on public.enrollments(course_id);
create index if not exists idx_lesson_progress_enrollment on public.lesson_progress(enrollment_id);
create index if not exists idx_live_classes_batch on public.live_classes(batch_id);
create index if not exists idx_attendance_student on public.attendance(student_id);
