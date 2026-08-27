import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database";

/**
 * Use inside Client Components only.
 * Requires @supabase/ssr and @supabase/supabase-js:
 *   npm install @supabase/ssr @supabase/supabase-js
 */
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://mzyihmimdkpfsgmjcdke.supabase.co";
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.placeholder";
  return createBrowserClient<Database>(url, anonKey);
}
