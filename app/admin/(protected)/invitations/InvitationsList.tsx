"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { templateDisplayName } from "@/lib/templates";
import { StatusButtons, DeleteButton } from "./RowActions";
import {
  PageHeader, StatusBadge, EmptyState, IconSearch, IconEye, IconChart, IconEdit, IconPlus,
} from "../ui";

export type InvRow = {
  id: string; title: string; slug: string; theme: string; status: string; created_at: string;
};

const FILTERS = [
  { id: "all", label: "Semua" },
  { id: "published", label: "Published" },
  { id: "draft", label: "Draft" },
  { id: "archived", label: "Arsip" },
];

export default function InvitationsList({ rows, base }: { rows: InvRow[]; base: string }) {
  const [q, setQ] = useState("");
  const [f, setF] = useState("all");

  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return rows.filter((r) =>
      (f === "all" || r.status === f) &&
      (!s || r.title.toLowerCase().includes(s) || r.slug.toLowerCase().includes(s))
    );
  }, [rows, q, f]);

  return (
    <div>
      <PageHeader
        title="Undangan"
        subtitle={`${rows.length} undangan tersimpan`}
        action={
          <Link href="/admin/invitations/new"
            className="inline-flex items-center gap-2 rounded-full bg-amber-300 px-5 py-2.5 text-sm font-semibold text-zinc-950 transition hover:bg-amber-200 active:scale-[0.98]">
            <IconPlus size={16} /> Buat Baru
          </Link>
        }
      />

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="relative flex-1">
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500">
            <IconSearch size={16} />
          </span>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari judul atau slug…"
            className="w-full rounded-xl border border-white/10 bg-black/40 py-2.5 pl-10 pr-3.5 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none transition focus:border-amber-300/70 focus:ring-2 focus:ring-amber-300/20" />
        </label>
        <div className="flex gap-1.5 overflow-x-auto pb-0.5">
          {FILTERS.map((x) => (
            <button key={x.id} type="button" onClick={() => setF(x.id)}
              className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-medium transition
                ${f === x.id ? "bg-amber-300 text-zinc-950" : "border border-white/10 bg-white/[0.03] text-zinc-400 hover:text-zinc-100"}`}>
              {x.label}
            </button>
          ))}
        </div>
      </div>

      {list.length === 0 ? (
        <div className="mt-5">
          <EmptyState
            title={q || f !== "all" ? "Tidak ketemu" : "Belum ada undangan"}
            hint={q || f !== "all" ? "Coba kata kunci atau filter lain." : "Buat undangan pertamamu sekarang."} />
        </div>
      ) : (
        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          {list.map((r) => (
            <article key={r.id} className="flex flex-col rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4 transition hover:border-white/[0.13]">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-[15px] font-medium text-zinc-50">{r.title}</p>
                  <p className="mt-1 truncate text-xs text-zinc-500">
                    undangen.my.id/i/{r.slug}
                  </p>
                  <p className="mt-0.5 text-xs text-zinc-600">
                    {templateDisplayName(r.theme)} · {new Date(r.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
                <StatusBadge status={r.status} />
              </div>
              <div className="mt-3.5 flex flex-wrap items-center gap-1.5 border-t border-white/[0.06] pt-3">
                <a href={`${base}/i/${r.slug}`} target="_blank" rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-xs text-zinc-300 transition hover:border-amber-300/40 hover:text-amber-200">
                  <IconEye size={13} /> Lihat
                </a>
                <a href={`${base}/pantau/${r.slug}`} target="_blank" rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-xs text-zinc-300 transition hover:border-amber-300/40 hover:text-amber-200">
                  <IconChart size={13} /> RSVP
                </a>
                <Link href={`/admin/invitations/${r.id}/edit`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-xs text-zinc-300 transition hover:border-amber-300/40 hover:text-amber-200">
                  <IconEdit size={13} /> Edit
                </Link>
                <span className="mx-0.5 hidden h-4 w-px bg-white/10 sm:block" />
                <StatusButtons id={r.id} status={r.status} />
                <span className="flex-1" />
                <DeleteButton id={r.id} title={r.title} />
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
