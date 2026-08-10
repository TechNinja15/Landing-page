import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * POST /auth/signout
 * Call from a form action or fetch() in the portal/admin sidebar,
 * e.g.:
 *   <form action="/auth/signout" method="post">
 *     <button type="submit">Log out</button>
 *   </form>
 */
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return NextResponse.redirect(new URL("/login", request.url), { status: 303 });
}
