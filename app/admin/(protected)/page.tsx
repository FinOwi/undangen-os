import Link from "next/link";
import { createClient } from "@/lib/supabase-server";

export default async function AdminDashboard() {
  const supabase = await createClient();
  const { data: rows } = await supabase
    .from("invitations")
    .select("id, title, slug, theme, status, created_at")
    .order("created_at", { ascending: false });

  const list = rows ?? [];
  const published = list.filter((r) => r.status === "published").length;
  const draft = list.filter((r) => r.status === "draft").length;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-amber-100">Dashboard</h1>
        <Link href="/admin/invitations/new"
          className="rounded-full bg-amber-300 px-5 py-2 text-sm font-semibold text-zinc-900 hover:bg-amber-200">
          + Buat Undangan
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-3">
        {[
          { label: "Total undangan", value: list.length },
          { label: "Published", value: published },
          { label: "Draft", value: draft },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
            <p className="text-3xl font-semibold text-amber-100">{s.value}</p>
            <p className="mt-1 text-xs text-zinc-400">{s.label}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-8 text-sm font-semibold uppercase tracking-widest text-zinc-400">Terbaru</h2>
      <div className="mt-3 flex flex-col gap-2">
        {list.slice(0, 5).map((r) => (
          <Link key={r.id} href="/admin/invitations"
            className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/40 px-4 py-3 hover:border-zinc-700">
            <div>
              <p className="text-sm font-medium text-zinc-100">{r.title}</p>
              <p className="text-xs text-zinc-500">/{r.slug} · {r.theme}</p>
            </div>
            <span className={`rounded-full px-2.5 py-1 text-[11px] ${r.status === "published" ? "bg-emerald-950 text-emerald-300" : "bg-zinc-800 text-zinc-400"}`}>
              {r.status}
            </span>
          </Link>
        ))}
        {list.length === 0 && (
          <p className="rounded-xl border border-dashed border-zinc-800 px-4 py-8 text-center text-sm text-zinc-500">
            Belum ada undangan. Buat yang pertama 👆
          </p>
        )}
      </div>
    </div>
  );
}
