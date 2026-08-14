import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getAdminDashboardData, getWebsiteSettings, getCounselors } from "@/lib/data/admin";
import AdminPortal from "@/components/admin/AdminPortal";

export const metadata: Metadata = {
  title: "Admin Portal",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirectTo=/admin");
  }

  const { data: profile } = await supabase.from("profiles").select("role, full_name, email").eq("id", user.id).single();

  // middleware.ts checks this too - duplicated here deliberately, same
  // reasoning as portal/page.tsx: don't let the admin UI render even
  // briefly for a non-admin session.
  if (!profile || !["admin", "super_admin"].includes(profile.role)) {
    redirect("/portal");
  }

  const [data, websiteSettings, counselors] = await Promise.all([
    getAdminDashboardData(supabase),
    getWebsiteSettings(supabase),
    getCounselors(supabase),
  ]);

  return <AdminPortal initialData={data} currentAdmin={profile} websiteSettings={websiteSettings} counselors={counselors} />;
}
