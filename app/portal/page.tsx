import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getStudentDashboardData } from "@/lib/data/student";
import StudentPortal from "@/components/portal/StudentPortal";

export const metadata: Metadata = {
  title: "Student Portal",
  robots: { index: false, follow: false }, // private app area, keep out of search results
};

export default async function PortalPage() {
  // middleware.ts already redirects unauthenticated requests before they
  // reach here — this is a second, server-side check rather than trusting
  // middleware alone, since middleware can be bypassed by direct edge
  // requests in some deployment setups.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirectTo=/portal");
  }

  const data = await getStudentDashboardData(supabase, user.id);

  return <StudentPortal initialData={data} />;
}
