import type { createClient } from "@/lib/supabase/server";

type TypedSupabaseClient = Awaited<ReturnType<typeof createClient>>;

export async function getAdminDashboardData(supabase: TypedSupabaseClient) {
  const [leadsRes, coursesRes, batchesRes, enrollmentsRes, paymentsRes] = await Promise.all([
    supabase
      .from("leads")
      .select("id, name, mobile, email, source, stage, notes, next_follow_up_date, last_contact_date, course_interested, assigned_counselor, courses:course_interested(title), profiles:assigned_counselor(full_name)")
      .order("created_at", { ascending: false }),
    supabase.from("courses").select("id, title, is_published, accent_color"),
    supabase.from("batches").select("id, name, course_id, trainer_id, capacity, status, profiles:trainer_id(full_name)"),
    supabase
      .from("enrollments")
      .select("id, student_id, course_id, batch_id, progress_percent, courses(title), batches(name), profiles:student_id(full_name)")
      .eq("status", "active"),
    // Revenue chart intentionally stays empty until payments exist - // no invented figures, matching the rest of this build.
    supabase.from("payments").select("student_id, course_id, amount, status, paid_at").eq("status", "paid"),
  ]);

  // module/batch counts per course, computed here rather than trusting
  // a denormalized column, since the schema doesn't keep one.
  const modulesRes = await supabase.from("modules").select("course_id");
  const moduleCountByCourse = new Map<string, number>();
  (modulesRes.data ?? []).forEach((m: any) => {
    moduleCountByCourse.set(m.course_id, (moduleCountByCourse.get(m.course_id) ?? 0) + 1);
  });

  const batchCountByCourse = new Map<string, number>();
  (batchesRes.data ?? []).forEach((b: any) => {
    batchCountByCourse.set(b.course_id, (batchCountByCourse.get(b.course_id) ?? 0) + 1);
  });

  const courses = (coursesRes.data ?? []).map((c: any) => ({
    ...c,
    moduleCount: moduleCountByCourse.get(c.id) ?? 0,
    batchCount: batchCountByCourse.get(c.id) ?? 0,
  }));

  return {
    leads: leadsRes.data ?? [],
    courses,
    batches: batchesRes.data ?? [],
    students: enrollmentsRes.data ?? [],
    payments: paymentsRes.data ?? [],
  };
}

export async function getWebsiteSettings(supabase: TypedSupabaseClient) {
  const { data } = await supabase.from("website_settings").select("key, value").in("key", ["hero_content", "hero_stats"]);
  const byKey = Object.fromEntries((data ?? []).map((row: any) => [row.key, row.value]));
  return {
    heroContent: byKey.hero_content ?? { headline: "", subheading: "" },
    heroStats: byKey.hero_stats ?? { students: null, projects: null, industry_experts: null },
  };
}

export async function getCounselors(supabase: TypedSupabaseClient) {
  const { data } = await supabase.from("profiles").select("id, full_name").in("role", ["admin", "super_admin"]);
  return data ?? [];
}
