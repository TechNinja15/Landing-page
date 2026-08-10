import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Every Supabase auth email (signup confirmation, password reset,
 * magic link) points here first via `emailRedirectTo` /
 * `redirectTo`, with a `code` query param. This exchanges that code
 * for a real session (setting the auth cookies), then forwards the
 * user on to wherever they actually need to go — `next` if the
 * caller specified one (forgot-password does, pointing at
 * /reset-password), otherwise role-based like login does.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next");

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=missing_code`);
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.session) {
    return NextResponse.redirect(`${origin}/login?error=invalid_or_expired_link`);
  }

  if (next) {
    return NextResponse.redirect(`${origin}${next}`);
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.session.user.id)
    .single();

  const destination = profile && ["admin", "super_admin"].includes(profile.role) ? "/admin" : "/portal";
  return NextResponse.redirect(`${origin}${destination}`);
}
