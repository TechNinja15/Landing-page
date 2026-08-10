-- ============================================================
-- 0005_row_level_security.sql
-- Enables RLS on every table and defines who can do what.
-- Uses public.current_user_role() / public.is_admin() (SECURITY
-- DEFINER, defined in 0001) so policies never recurse into RLS.
-- ============================================================

-- ---------- profiles ----------
alter table public.profiles enable row level security;

create policy "profiles_select_own_or_admin"
  on public.profiles for select
  using (id = auth.uid() or public.is_admin());

create policy "profiles_update_own_or_admin"
  on public.profiles for update
  using (id = auth.uid() or public.is_admin());

create policy "profiles_admin_insert"
  on public.profiles for insert
  with check (public.is_admin());

-- trainers visible to everyone authenticated (public trainer bios on site)
create policy "trainer_profiles_read_all"
  on public.trainer_profiles for select
  using (true);

create policy "trainer_profiles_write_own_or_admin"
  on public.trainer_profiles for all
  using (id = auth.uid() or public.is_admin())
  with check (id = auth.uid() or public.is_admin());

alter table public.trainer_profiles enable row level security;

-- ---------- courses / modules / lessons ----------
alter table public.courses enable row level security;
alter table public.modules enable row level security;
alter table public.lessons enable row level security;

create policy "courses_public_read_published"
  on public.courses for select
  using (is_published = true or public.is_admin());

create policy "courses_admin_write"
  on public.courses for all
  using (public.is_admin()) with check (public.is_admin());

-- modules/lessons: visible if the parent course is published (marketing preview)
-- OR the viewer is enrolled OR the viewer is admin/the assigned trainer.
create policy "modules_read"
  on public.modules for select
  using (
    public.is_admin()
    or exists (select 1 from public.courses c where c.id = course_id and c.is_published)
    or exists (
      select 1 from public.enrollments e
      where e.course_id = modules.course_id and e.student_id = auth.uid()
    )
  );

create policy "modules_admin_write"
  on public.modules for all
  using (public.is_admin()) with check (public.is_admin());

create policy "lessons_read"
  on public.lessons for select
  using (
    is_free_preview
    or public.is_admin()
    or exists (
      select 1 from public.modules m
      join public.enrollments e on e.course_id = m.course_id
      where m.id = lessons.module_id and e.student_id = auth.uid()
    )
    or exists (
      select 1 from public.modules m
      join public.batches b on b.course_id = m.course_id
      where m.id = lessons.module_id and b.trainer_id = auth.uid()
    )
  );

create policy "lessons_admin_write"
  on public.lessons for all
  using (public.is_admin()) with check (public.is_admin());

-- ---------- batches ----------
alter table public.batches enable row level security;

create policy "batches_read"
  on public.batches for select
  using (
    public.is_admin()
    or trainer_id = auth.uid()
    or exists (select 1 from public.enrollments e where e.batch_id = batches.id and e.student_id = auth.uid())
  );

create policy "batches_admin_write"
  on public.batches for all
  using (public.is_admin()) with check (public.is_admin());

-- ---------- enrollments ----------
alter table public.enrollments enable row level security;

create policy "enrollments_read_own_or_staff"
  on public.enrollments for select
  using (
    student_id = auth.uid()
    or public.is_admin()
    or exists (select 1 from public.batches b where b.id = enrollments.batch_id and b.trainer_id = auth.uid())
  );

create policy "enrollments_admin_write"
  on public.enrollments for all
  using (public.is_admin()) with check (public.is_admin());

-- ---------- lesson_progress ----------
alter table public.lesson_progress enable row level security;

create policy "lesson_progress_owner"
  on public.lesson_progress for all
  using (
    exists (select 1 from public.enrollments e where e.id = enrollment_id and e.student_id = auth.uid())
    or public.is_admin()
  )
  with check (
    exists (select 1 from public.enrollments e where e.id = enrollment_id and e.student_id = auth.uid())
    or public.is_admin()
  );

-- ---------- live_classes ----------
alter table public.live_classes enable row level security;

create policy "live_classes_read"
  on public.live_classes for select
  using (
    public.is_admin()
    or exists (select 1 from public.batches b where b.id = batch_id and b.trainer_id = auth.uid())
    or exists (
      select 1 from public.enrollments e where e.batch_id = live_classes.batch_id and e.student_id = auth.uid()
    )
  );

create policy "live_classes_staff_write"
  on public.live_classes for all
  using (
    public.is_admin()
    or exists (select 1 from public.batches b where b.id = batch_id and b.trainer_id = auth.uid())
  )
  with check (
    public.is_admin()
    or exists (select 1 from public.batches b where b.id = batch_id and b.trainer_id = auth.uid())
  );

-- ---------- attendance ----------
alter table public.attendance enable row level security;

create policy "attendance_read_own_or_staff"
  on public.attendance for select
  using (
    student_id = auth.uid()
    or public.is_admin()
    or exists (
      select 1 from public.live_classes lc join public.batches b on b.id = lc.batch_id
      where lc.id = attendance.live_class_id and b.trainer_id = auth.uid()
    )
  );

create policy "attendance_staff_write"
  on public.attendance for insert
  with check (
    public.is_admin()
    or exists (
      select 1 from public.live_classes lc join public.batches b on b.id = lc.batch_id
      where lc.id = attendance.live_class_id and b.trainer_id = auth.uid()
    )
  );

create policy "attendance_staff_update"
  on public.attendance for update
  using (
    public.is_admin()
    or exists (
      select 1 from public.live_classes lc join public.batches b on b.id = lc.batch_id
      where lc.id = attendance.live_class_id and b.trainer_id = auth.uid()
    )
  );

-- ---------- assignments ----------
alter table public.assignments enable row level security;

create policy "assignments_read"
  on public.assignments for select
  using (
    public.is_admin()
    or exists (select 1 from public.enrollments e where e.course_id = assignments.course_id and e.student_id = auth.uid())
    or exists (select 1 from public.batches b where b.course_id = assignments.course_id and b.trainer_id = auth.uid())
  );

create policy "assignments_staff_write"
  on public.assignments for all
  using (
    public.is_admin()
    or exists (select 1 from public.batches b where b.course_id = assignments.course_id and b.trainer_id = auth.uid())
  )
  with check (
    public.is_admin()
    or exists (select 1 from public.batches b where b.course_id = assignments.course_id and b.trainer_id = auth.uid())
  );

-- ---------- submissions ----------
alter table public.submissions enable row level security;

create policy "submissions_student_own"
  on public.submissions for select
  using (
    student_id = auth.uid()
    or public.is_admin()
    or exists (
      select 1 from public.assignments a join public.batches b on b.course_id = a.course_id
      where a.id = submissions.assignment_id and b.trainer_id = auth.uid()
    )
  );

create policy "submissions_student_insert"
  on public.submissions for insert
  with check (student_id = auth.uid());

create policy "submissions_student_resubmit"
  on public.submissions for update
  using (student_id = auth.uid())
  with check (student_id = auth.uid());

create policy "submissions_staff_review"
  on public.submissions for update
  using (
    public.is_admin()
    or exists (
      select 1 from public.assignments a join public.batches b on b.course_id = a.course_id
      where a.id = submissions.assignment_id and b.trainer_id = auth.uid()
    )
  );

-- ---------- certificates ----------
alter table public.certificates enable row level security;

create policy "certificates_read_own_or_admin"
  on public.certificates for select
  using (student_id = auth.uid() or public.is_admin());

create policy "certificates_admin_write"
  on public.certificates for all
  using (public.is_admin()) with check (public.is_admin());

-- ---------- payments ----------
alter table public.payments enable row level security;

create policy "payments_read_own_or_admin"
  on public.payments for select
  using (student_id = auth.uid() or public.is_admin());

create policy "payments_admin_write"
  on public.payments for all
  using (public.is_admin()) with check (public.is_admin());

-- ---------- leads (mini CRM) ----------
alter table public.leads enable row level security;

-- public website can create leads (demo bookings, lead-magnet form) but never read them
create policy "leads_public_insert"
  on public.leads for insert
  to anon, authenticated
  with check (true);

create policy "leads_staff_read"
  on public.leads for select
  using (public.is_admin() or assigned_counselor = auth.uid());

create policy "leads_staff_write"
  on public.leads for update
  using (public.is_admin() or assigned_counselor = auth.uid());

create policy "leads_admin_delete"
  on public.leads for delete
  using (public.is_admin());

-- ---------- contact_messages ----------
alter table public.contact_messages enable row level security;

create policy "contact_messages_public_insert"
  on public.contact_messages for insert
  to anon, authenticated
  with check (true);

create policy "contact_messages_admin_read"
  on public.contact_messages for select
  using (public.is_admin());

create policy "contact_messages_admin_update"
  on public.contact_messages for update
  using (public.is_admin());

-- ---------- announcements ----------
alter table public.announcements enable row level security;

create policy "announcements_read"
  on public.announcements for select
  using (
    audience = 'all'
    or public.is_admin()
    or (audience = 'students' and public.current_user_role() = 'student')
    or (audience = 'trainers' and public.current_user_role() = 'trainer')
    or (audience = 'batch' and exists (
      select 1 from public.enrollments e where e.batch_id = announcements.batch_id and e.student_id = auth.uid()
    ))
  );

create policy "announcements_admin_write"
  on public.announcements for all
  using (public.is_admin()) with check (public.is_admin());

-- ---------- resources ----------
alter table public.resources enable row level security;

create policy "resources_public_read"
  on public.resources for select
  using (true);

create policy "resources_admin_write"
  on public.resources for all
  using (public.is_admin()) with check (public.is_admin());

-- ---------- website_settings ----------
alter table public.website_settings enable row level security;

create policy "website_settings_public_read"
  on public.website_settings for select
  using (true);

create policy "website_settings_admin_write"
  on public.website_settings for all
  using (public.is_admin()) with check (public.is_admin());
