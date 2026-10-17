import { createClient } from "@supabase/supabase-js";

// Client publik TANPA sesi — hanya bisa baca undangan berstatus published (via RLS).
export function createPublicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
