import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const STUDENT_PREFIX = "/portal";
const ADMIN_PREFIX = "/admin";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;

  // Unauthenticated users hitting protected areas -> login
  if (!user && (path.startsWith(STUDENT_PREFIX) || path.startsWith(ADMIN_PREFIX))) {
    const redirectUrl = new URL("/login", request.url);
    redirectUrl.searchParams.set("redirectTo", path);
    return NextResponse.redirect(redirectUrl);
  }

  // Role check for /admin — student/trainer accounts get bounced to the portal
  if (user && path.startsWith(ADMIN_PREFIX)) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile || !["admin", "super_admin"].includes(profile.role)) {
      return NextResponse.redirect(new URL("/portal", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ["/portal/:path*", "/admin/:path*"],
};
