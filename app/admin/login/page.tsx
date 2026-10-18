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
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0b0d12] px-5">
      <div className="pointer-events-none absolute -top-32 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-amber-300/10 blur-3xl" />
      <form onSubmit={onSubmit}
        className="relative w-full max-w-sm rounded-3xl border border-white/[0.08] bg-white/[0.03] p-7 shadow-2xl shadow-black/50 backdrop-blur md:p-8">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-300 text-xl font-bold text-zinc-950">U</span>
          <div>
            <p className="text-[11px] uppercase tracking-[0.25em] text-amber-200/60">Undangen OS</p>
            <h1 className="text-xl font-semibold text-zinc-50">Masuk Admin</h1>
          </div>
        </div>
        <label className="mt-7 block text-xs font-medium text-zinc-400">Email</label>
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
          autoComplete="email" placeholder="admin@undangen.my.id"
          className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none transition focus:border-amber-300/70 focus:ring-2 focus:ring-amber-300/20" />
        <label className="mt-4 block text-xs font-medium text-zinc-400">Password</label>
        <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password" placeholder="••••••••"
          className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none transition focus:border-amber-300/70 focus:ring-2 focus:ring-amber-300/20" />
        {err && <p className="mt-4 rounded-xl border border-red-400/20 bg-red-950/50 px-3.5 py-2.5 text-xs text-red-300">{err}</p>}
        <button disabled={loading}
          className="mt-6 w-full rounded-full bg-amber-300 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-amber-200 active:scale-[0.99] disabled:opacity-50">
          {loading ? "Masuk…" : "Masuk"}
        </button>
        <p className="mt-5 text-center text-[11px] text-zinc-600">Undangen · undangan digital interaktif</p>
      </form>
    </main>
  );
}
