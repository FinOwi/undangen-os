"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase-client";

interface GuestLink {
  id: string; token: string; guest_name: string;
  open_count: number; revoked: boolean; first_opened_at: string | null;
}

// Token browser-safe (96 bit).
function newToken(): string {
  const b = new Uint8Array(12);
  crypto.getRandomValues(b);
  return btoa(String.fromCharCode(...b)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "").slice(0, 16);
}

export default function GuestManager({ invitationId, slug, couple }: {
  invitationId: string; slug: string; couple: string;
}) {
  const base = (process.env.NEXT_PUBLIC_APP_URL ?? "").replace(/\/$/, "");
  const [rows, setRows] = useState<GuestLink[]>([]);
  const [names, setNames] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  async function load() {
    const supabase = createClient();
    const { data } = await supabase.from("guest_links")
      .select("id, token, guest_name, open_count, revoked, first_opened_at")
      .eq("invitation_id", invitationId).order("created_at");
    setRows((data ?? []) as GuestLink[]);
  }
  useEffect(() => { load(); }, [invitationId]);

  async function addGuests() {
    const list = names.split("\n").map((s) => s.trim()).filter(Boolean);
    if (!list.length) return;
    setBusy(true); setMsg("");
    const supabase = createClient();
    const payload = list.map((guest_name) => ({ invitation_id: invitationId, token: newToken(), guest_name }));
    const { error } = await supabase.from("guest_links").insert(payload);
    setBusy(false);
    if (error) { setMsg("Gagal: " + error.message); return; }
    setNames(""); setMsg(`${list.length} tautan dibuat.`); load();
  }

  async function toggleRevoke(r: GuestLink) {
    const supabase = createClient();
    await supabase.from("guest_links").update({ revoked: !r.revoked }).eq("id", r.id);
    load();
  }
  async function resetDevice(r: GuestLink) {
    const supabase = createClient();
    await supabase.from("guest_links").update({ device_hash: null, first_opened_at: null, open_count: 0 }).eq("id", r.id);
    setMsg(`Perangkat ${r.guest_name} di-reset.`); load();
  }
  async function remove(r: GuestLink) {
    if (!confirm(`Hapus tautan untuk ${r.guest_name}?`)) return;
    const supabase = createClient();
    await supabase.from("guest_links").delete().eq("id", r.id);
    load();
  }

  function linkOf(r: GuestLink) { return `${base}/i/${slug}?t=${r.token}`; }
  function copy(t: string) { navigator.clipboard.writeText(t); setMsg("Tautan disalin."); }

  return (
    <div className="md:col-span-2 flex flex-col gap-4">
      <div>
        <p className="text-xs text-zinc-400">Tambah tamu (satu nama per baris) — tiap tamu dapat tautan unik anti-forward.</p>
        <textarea value={names} onChange={(e) => setNames(e.target.value)} rows={3}
          placeholder={"Keluarga Besar Tarigan\nMaria br Ginting sekeluarga"}
          className="mt-2 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm outline-none focus:border-amber-300" />
        <button type="button" onClick={addGuests} disabled={busy}
          className="mt-2 rounded-full bg-amber-300 px-5 py-2 text-sm font-semibold text-zinc-900 disabled:opacity-50">
          {busy ? "Membuat…" : `Buat tautan (${names.split("\n").filter((s) => s.trim()).length})`}
        </button>
        {msg && <p className="mt-2 text-xs text-amber-200">{msg}</p>}
      </div>
      {rows.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-zinc-800">
          <table className="w-full text-left text-xs">
            <thead><tr className="border-b border-zinc-800 text-zinc-500">
              <th className="px-3 py-2">Tamu</th><th className="px-3 py-2">Tautan</th>
              <th className="px-3 py-2">Dibuka</th><th className="px-3 py-2">Aksi</th>
            </tr></thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className={`border-b border-zinc-800/60 ${r.revoked ? "opacity-45" : ""}`}>
                  <td className="px-3 py-2 font-medium text-zinc-100">{r.guest_name || <i className="text-zinc-500">tanpa nama</i>}</td>
                  <td className="px-3 py-2">
                    <button type="button" onClick={() => copy(linkOf(r))} className="text-amber-200 underline underline-offset-2">Salin tautan</button>
                    <a className="ml-3 text-emerald-300 underline underline-offset-2" target="_blank" rel="noreferrer"
                      href={`https://wa.me/?text=${encodeURIComponent(
                        `Yth. ${r.guest_name},\nKami mengundang ke pernikahan ${couple}.\nTautan pribadi (jangan diteruskan):\n${linkOf(r)}`
                      )}`}>Kirim WA</a>
                  </td>
                  <td className="px-3 py-2 text-zinc-400">{r.open_count}×{r.first_opened_at ? " ✓" : ""}</td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <button type="button" onClick={() => toggleRevoke(r)} className="text-zinc-300 underline underline-offset-2">
                      {r.revoked ? "Aktifkan" : "Cabut"}</button>
                    <button type="button" onClick={() => resetDevice(r)} className="ml-3 text-zinc-300 underline underline-offset-2">Reset HP</button>
                    <button type="button" onClick={() => remove(r)} className="ml-3 text-red-300 underline underline-offset-2">Hapus</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
