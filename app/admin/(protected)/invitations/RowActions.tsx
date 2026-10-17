"use client";
import { useState } from "react";
import { toggleStatus, deleteInvitation } from "./actions";

export function StatusButtons({ id, status }: { id: string; status: string }) {
  const [busy, setBusy] = useState(false);
  async function go(next: "draft" | "published" | "archived") {
    if (busy) return; setBusy(true);
    try { await toggleStatus(id, next); } finally { setBusy(false); }
  }
  return (
    <div className="flex gap-1.5">
      {status !== "published" && (
        <button disabled={busy} onClick={() => go("published")}
          className="rounded-full bg-emerald-900/60 px-3 py-1 text-[11px] text-emerald-200 hover:bg-emerald-900">Publish</button>
      )}
      {status === "published" && (
        <button disabled={busy} onClick={() => go("draft")}
          className="rounded-full bg-zinc-800 px-3 py-1 text-[11px] text-zinc-300 hover:bg-zinc-700">Unpublish</button>
      )}
      {status !== "archived" && (
        <button disabled={busy} onClick={() => go("archived")}
          className="rounded-full bg-zinc-800 px-3 py-1 text-[11px] text-zinc-400 hover:bg-zinc-700">Arsip</button>
      )}
    </div>
  );
}

export function DeleteButton({ id, title }: { id: string; title: string }) {
  const [busy, setBusy] = useState(false);
  async function go() {
    if (!confirm(`Hapus undangan "${title}"? Data RSVP di Firebase tidak ikut terhapus.`)) return;
    setBusy(true);
    try { await deleteInvitation(id); } finally { setBusy(false); }
  }
  return (
    <button disabled={busy} onClick={go}
      className="rounded-full px-3 py-1 text-[11px] text-red-400 hover:bg-red-950/60">
      Hapus
    </button>
  );
}
