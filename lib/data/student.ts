import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

/**
 * All queries here run server-side (called from app/portal/page.tsx,
 * a Server Component) with the user's own session - so RLS applies
 * exactly as it would for any authenticated request. Nothing here
 * uses the service-role client.
 *
 * Deliberately split into several targeted queries rather than one
 * deep PostgREST embed - easier to reason about, and avoids the
 * embedded-filter footguns (e.g. filtering a joined table by a
 * column that isn't the join key) that come up with nested selects.
 */

export async function getStudentDashboardData(supabase: SupabaseClient<Database>, userId: string) {
  const [profileRes, enrollmentsRes] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", userId).single(),
    supabase
      .from("enrollments")
      .select("id, course_id, batch_id, status, progress_percent, courses(title, accent_color), batches(id, name)")
      .eq("student_id", userId)
      .order("enrolled_at", { ascending: false }),
  ]);

  const profile = profileRes.data;
  const enrollments = enrollmentsRes.data ?? [];
  const batchIds = enrollments.map((e: any) => e.batch_id).filter(Boolean);
  const courseIds = enrollments.map((e: any) => e.course_id).filter(Boolean);

  const [liveClassesRes, assignmentsRes, certificatesRes, announcementsRes] = await Promise.all([
    batchIds.length
      ? supabase
          .from("live_classes")
          .select("id, title, scheduled_at, zoom_link, batches(name, trainer_id, profiles:trainer_id(full_name))")
          .in("batch_id", batchIds)
          .gte("scheduled_at", new Date().toISOString())
          .order("scheduled_at", { ascending: true })
          .limit(5)
      : Promise.resolve({ data: [] }),
    courseIds.length
      ? supabase.from("assignments").select("id, title, course_id, due_date, courses(title)").in("course_id", courseIds)
      : Promise.resolve({ data: [] }),
    supabase.from("certificates").select("id, course_id, certificate_number, issued_at, pdf_url, courses(title)").eq("student_id", userId),
    supabase
      .from("announcements")
      .select("id, title, published_at, audience, batch_id")
      .or(`audience.eq.all,audience.eq.students${batchIds.length ? `,and(audience.eq.batch,batch_id.in.(${batchIds.join(",")}))` : ""}`)
      .order("published_at", { ascending: false })
      .limit(5),
  ]);

  // Submissions are fetched separately (not embedded) and merged in JS - // more reliable than PostgREST's embedded-resource filtering for a
  // "give me my submission, if I have one, for each assignment" shape.
  const assignmentIds = (assignmentsRes.data ?? []).map((a: any) => a.id);
  const submissionsRes = assignmentIds.length
    ? await supabase.from("submissions").select("*").eq("student_id", userId).in("assignment_id", assignmentIds)
    : { data: [] };

  const submissionsByAssignment = new Map((submissionsRes.data ?? []).map((s: any) => [s.assignment_id, s]));
  const assignments = (assignmentsRes.data ?? []).map((a: any) => ({
    ...a,
    submission: submissionsByAssignment.get(a.id) ?? null,
  }));

  return {
    profile,
    enrollments,
    liveClasses: liveClassesRes.data ?? [],
    assignments,
    certificates: certificatesRes.data ?? [],
    announcements: announcementsRes.data ?? [],
  };
}

/**
 * Module/lesson breakdown for a single course, with per-module
 * completion counts against the student's lesson_progress rows.
 * Called for whichever enrollment the student is currently viewing
 * in "My Courses" - not all enrollments at once, to keep this cheap.
 */
export async function getCourseDetail(supabase: SupabaseClient<Database>, enrollmentId: string, courseId: string) {
  const [modulesRes, progressRes] = await Promise.all([
    supabase.from("modules").select("id, title, order_index").eq("course_id", courseId).order("order_index"),
    supabase.from("lesson_progress").select("lesson_id, completed").eq("enrollment_id", enrollmentId),
  ]);

  const modules = modulesRes.data ?? [];
  const moduleIds = modules.map((m: any) => m.id);

  const lessonsForModules = moduleIds.length
    ? (await supabase.from("lessons").select("id, module_id").in("module_id", moduleIds)).data ?? []
    : [];

  const completedLessonIds = new Set(
    (progressRes.data ?? []).filter((p: any) => p.completed).map((p: any) => p.lesson_id)
  );

  return modules.map((m: any) => {
    const lessonsInModule = lessonsForModules.filter((l: any) => l.module_id === m.id);
    const done = lessonsInModule.filter((l: any) => completedLessonIds.has(l.id)).length;
    return { id: m.id, title: m.title, lessons: lessonsInModule.length, done };
  });
}
