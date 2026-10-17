"use client";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-client";

export default function LogoutButton() {
  const router = useRouter();
  async function logout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }
  return (
    <button onClick={logout} className="rounded-full border border-zinc-700 px-4 py-1.5 text-xs text-zinc-300 hover:border-zinc-500">
      Keluar
    </button>
  );
}
