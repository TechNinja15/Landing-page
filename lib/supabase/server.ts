import { createServerClient } from "@supabase/ssr";
import { createClient as createRawClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import type { Database } from "@/types/database";

/**
 * Use inside Server Components, Server Actions, and Route Handlers.
 * Never expose the service_role key to the client — this uses the
 * anon key and relies on RLS for access control.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // called from a Server Component — safe to ignore if you
            // have middleware refreshing sessions (see middleware.ts)
          }
        },
      },
    }
  );
}

/**
 * Service-role client — SERVER ONLY (route handlers / server actions),
 * never imported into client bundles. Bypasses RLS. Use sparingly:
 * e.g. certificate generation, bulk admin operations.
 */
export function createServiceClient() {
  return createRawClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
