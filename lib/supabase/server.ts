import { createServerClient } from "@supabase/ssr";
import { createClient as createRawClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import type { Database } from "@/types/database";

/**
 * Use inside Server Components, Server Actions, and Route Handlers.
 * Never expose the service_role key to the client - this uses the
 * anon key and relies on RLS for access control.
 */
export async function createClient() {
  const cookieStore = await cookies();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://mzyihmimdkpfsgmjcdke.supabase.co";
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.placeholder";

  return createServerClient<Database>(
    url,
    anonKey,
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
            // called from a Server Component - safe to ignore if you
            // have middleware refreshing sessions (see middleware.ts)
          }
        },
      },
    }
  );
}

/**
 * Service-role client - SERVER ONLY (route handlers / server actions),
 * never imported into client bundles. Bypasses RLS. Use sparingly:
 * e.g. certificate generation, bulk admin operations.
 */
export function createServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://mzyihmimdkpfsgmjcdke.supabase.co";
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-service-key";

  return createRawClient<Database>(
    url,
    serviceKey,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
