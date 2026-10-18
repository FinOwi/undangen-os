import Link from "next/link";
import { createClient } from "@/lib/supabase-server";
import { templateDisplayName } from "@/lib/templates";
import { StatusButtons, DeleteButton } from "./RowActions";

export default async function InvitationsPage() {
  const supabase = await createClient();
  const { data: rows } = await supabase
    .from("invitations")
    .select("id, title, slug, theme, status, created_at")
    .order("created_at", { ascending: false });

  const list = rows ?? [];
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "";

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-amber-100">Undangan</h1>
        <Link href="/admin/invitations/new"
          className="rounded-full bg-amber-300 px-5 py-2 text-sm font-semibold text-zinc-900 hover:bg-amber-200">
          + Buat Baru
        </Link>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        {list.map((r) => (
          <div key={r.id} className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-medium text-zinc-100">{r.title}</p>
                <p className="text-xs text-zinc-500">/{r.slug} · {templateDisplayName(r.theme)} · {new Date(r.created_at).toLocaleDateString("id-ID")}</p>
              </div>
              <span className={`rounded-full px-2.5 py-1 text-[11px] ${
                r.status === "published" ? "bg-emerald-950 text-emerald-300"
                : r.status === "archived" ? "bg-zinc-800 text-zinc-500"
                : "bg-amber-950/60 text-amber-200"}`}>{r.status}</span>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-zinc-800/70 pt-3">
              <a href={`${base}/i/${r.slug}`} target="_blank" rel="noreferrer"
                className="rounded-full border border-zinc-700 px-3 py-1 text-[11px] text-zinc-300 hover:border-amber-300/50">Lihat ↗</a>
              <a href={`${base}/pantau/${r.slug}`} target="_blank" rel="noreferrer"
                className="rounded-full border border-zinc-700 px-3 py-1 text-[11px] text-zinc-300 hover:border-amber-300/50">Pantau RSVP ↗</a>
              <Link href={`/admin/invitations/${r.id}/edit`}
                className="rounded-full border border-zinc-700 px-3 py-1 text-[11px] text-zinc-300 hover:border-amber-300/50">Edit</Link>
              <StatusButtons id={r.id} status={r.status} />
              <DeleteButton id={r.id} title={r.title} />
            </div>
          </div>
        ))}
        {list.length === 0 && (
          <p className="rounded-xl border border-dashed border-zinc-800 px-4 py-10 text-center text-sm text-zinc-500">
            Belum ada undangan.
          </p>
        )}
      </div>
    </div>
  );
}
