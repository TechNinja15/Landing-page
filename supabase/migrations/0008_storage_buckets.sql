-- ============================================================
-- 0008_storage_buckets.sql
-- The `certificates` bucket was created in 0007 (system-written
-- only, by the Edge Function). These five are user/admin-facing —
-- each gets a policy shaped around who's actually allowed to
-- write there, not just "authenticated users can do anything."
-- ============================================================

insert into storage.buckets (id, name, public)
values
  ('avatars', 'avatars', true),        -- profile photos — public so they render without signed URLs
  ('resumes', 'resumes', false),       -- private: only the student + staff should read these
  ('assignments', 'assignments', false), -- private: submission files
  ('resources', 'resources', true),    -- public: downloadable guides/checklists (lead magnets)
  ('course-notes', 'course-notes', false) -- private: gated behind enrollment
on conflict (id) do nothing;

-- ---------- avatars ----------
-- Public read (needed to display any student/trainer's photo anywhere
-- in the UI); each user may only write to their own folder, enforced
-- by requiring the first path segment to equal their own user id
-- (e.g. avatars/<user_id>/photo.jpg).
create policy "avatars_public_read"
  on storage.objects for select
  using (bucket_id = 'avatars');

create policy "avatars_owner_write"
  on storage.objects for insert
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "avatars_owner_update"
  on storage.objects for update
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "avatars_owner_delete"
  on storage.objects for delete
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

-- ---------- resumes ----------
-- Private: the owning student, or staff (admin/trainer), can read.
-- Only the owning student can upload their own resume.
create policy "resumes_owner_or_staff_read"
  on storage.objects for select
  using (
    bucket_id = 'resumes'
    and (
      (storage.foldername(name))[1] = auth.uid()::text
      or public.current_user_role() in ('admin', 'super_admin', 'trainer')
    )
  );

create policy "resumes_owner_write"
  on storage.objects for insert
  with check (bucket_id = 'resumes' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "resumes_owner_update"
  on storage.objects for update
  using (bucket_id = 'resumes' and (storage.foldername(name))[1] = auth.uid()::text);

-- ---------- assignments (submission files) ----------
-- Same shape as resumes: owning student + staff can read; only the
-- owning student can upload. Path convention: assignments/<student_id>/<assignment_id>/<filename>.
create policy "assignment_files_owner_or_staff_read"
  on storage.objects for select
  using (
    bucket_id = 'assignments'
    and (
      (storage.foldername(name))[1] = auth.uid()::text
      or public.current_user_role() in ('admin', 'super_admin', 'trainer')
    )
  );

create policy "assignment_files_owner_write"
  on storage.objects for insert
  with check (bucket_id = 'assignments' and (storage.foldername(name))[1] = auth.uid()::text);

-- ---------- resources (public downloadables / lead magnets) ----------
-- Public read (that's the entire point of a lead-magnet PDF); only
-- staff can upload new ones.
create policy "resources_public_read"
  on storage.objects for select
  using (bucket_id = 'resources');

create policy "resources_admin_write"
  on storage.objects for insert
  with check (bucket_id = 'resources' and public.is_admin());

create policy "resources_admin_update"
  on storage.objects for update
  using (bucket_id = 'resources' and public.is_admin());

create policy "resources_admin_delete"
  on storage.objects for delete
  using (bucket_id = 'resources' and public.is_admin());

-- ---------- course-notes (lesson PDFs, gated behind enrollment) ----------
-- Private: readable by admins/trainers, or by a student enrolled in
-- the course the note belongs to. Path convention:
-- course-notes/<course_id>/<lesson_id>/<filename>.
create policy "course_notes_enrolled_or_staff_read"
  on storage.objects for select
  using (
    bucket_id = 'course-notes'
    and (
      public.current_user_role() in ('admin', 'super_admin', 'trainer')
      or exists (
        select 1 from public.enrollments e
        where e.student_id = auth.uid()
          and e.course_id::text = (storage.foldername(name))[1]
      )
    )
  );

create policy "course_notes_admin_write"
  on storage.objects for insert
  with check (bucket_id = 'course-notes' and public.is_admin());
