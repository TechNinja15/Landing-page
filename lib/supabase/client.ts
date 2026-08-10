import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database";

/**
 * Use inside Client Components only.
 * Requires @supabase/ssr and @supabase/supabase-js:
 *   npm install @supabase/ssr @supabase/supabase-js
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
