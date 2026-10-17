"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-client";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(""); setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) { setErr("Login gagal: " + error.message); return; }
    router.push("/admin");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <form onSubmit={onSubmit} className="w-full max-w-sm rounded-2xl border border-zinc-800 bg-zinc-900/60 p-8">
        <p className="text-xs uppercase tracking-[0.3em] text-amber-200/60">Simcha OS</p>
        <h1 className="mt-2 text-2xl font-semibold text-amber-100">Masuk Admin</h1>
        <label className="mt-6 block text-xs text-zinc-400">Email</label>
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm outline-none focus:border-amber-300" />
        <label className="mt-4 block text-xs text-zinc-400">Password</label>
        <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
          className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm outline-none focus:border-amber-300" />
        {err && <p className="mt-4 rounded-lg bg-red-950/60 px-3 py-2 text-xs text-red-300">{err}</p>}
        <button disabled={loading}
          className="mt-6 w-full rounded-full bg-amber-300 py-2.5 text-sm font-semibold text-zinc-900 hover:bg-amber-200 disabled:opacity-50">
          {loading ? "Masuk…" : "Masuk"}
        </button>
      </form>
    </main>
  );
}
