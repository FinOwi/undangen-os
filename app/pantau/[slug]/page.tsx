"use client";
import { useEffect, useState } from "react";

// Pantau RSVP — baca langsung dari Firebase (backend RSVP existing, read publik).
const FB_PID = "simcha-rsvp";
const FB_KEY = "<redacted>";
const FB_BASE = `https://firestore.googleapis.com/v1/projects/${FB_PID}/databases/(default)/documents`;

interface Row { name?: string; attendance?: string; guestCount?: number; message?: string; createdAt?: string; }

function unwrap(f: Record<string, any>): Row {
  const o: Row = {};
  for (const k of Object.keys(f)) {
    const v = f[k];
    if (v?.stringValue !== undefined) (o as any)[k] = v.stringValue;
    else if (v?.integerValue !== undefined) (o as any)[k] = parseInt(v.integerValue, 10);
  }
  return o;
}

export default function PantauPage({ params }: { params: Promise<{ slug: string }> }) {
  const [slug, setSlug] = useState("");
  const [rows, setRows] = useState<Row[]>([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    params.then(async ({ slug }) => {
      setSlug(slug);
      try {
        const res = await fetch(`${FB_BASE}:runQuery?key=${FB_KEY}`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ structuredQuery: {
            from: [{ collectionId: "rsvps" }],
            where: { fieldFilter: { field: { fieldPath: "slug" }, op: "EQUAL", value: { stringValue: slug } } },
            orderBy: [{ field: { fieldPath: "createdAt" }, direction: "DESCENDING" }],
            limit: 500,
          }}),
        });
        if (!res.ok) throw new Error("HTTP " + res.status);
        const j = await res.json();
        const list = (j || []).filter((x: any) => x.document?.fields).map((x: any) => unwrap(x.document.fields));
        setRows(list);
      } catch (e: any) { setErr("Gagal memuat: " + e.message); }
      finally { setLoading(false); }
    });
  }, [params]);

  const hadir = rows.filter((r) => r.attendance === "hadir");
  const tidak = rows.filter((r) => r.attendance === "tidak");
  const tamu = hadir.reduce((s, r) => s + (r.guestCount || 1), 0);
  const ucapan = rows.filter((r) => r.message);

  return (
    <main className="mx-auto max-w-3xl px-5 py-10">
      <p className="text-xs uppercase tracking-[0.3em] text-amber-200/60">Simcha · Pantau RSVP</p>
      <h1 className="mt-2 text-2xl font-semibold text-amber-100">/{slug}</h1>

      {loading && <p className="mt-8 text-sm text-zinc-400">Memuat…</p>}
      {err && <p className="mt-8 rounded-xl bg-red-950/60 px-4 py-3 text-sm text-red-300">{err}</p>}

      {!loading && !err && (
        <>
          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              { label: "Respon masuk", value: rows.length },
              { label: "Hadir", value: hadir.length },
              { label: "Berhalangan", value: tidak.length },
              { label: "Estimasi tamu", value: tamu },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
                <p className="text-2xl font-semibold text-amber-100">{s.value}</p>
                <p className="mt-1 text-xs text-zinc-400">{s.label}</p>
              </div>
            ))}
          </div>

          <h2 className="mt-8 text-sm font-semibold uppercase tracking-widest text-zinc-400">
            Ucapan ({ucapan.length})
          </h2>
          <div className="mt-3 flex flex-col gap-2">
            {ucapan.map((r, i) => (
              <div key={i} className="rounded-xl border border-zinc-800 bg-zinc-900/40 px-4 py-3">
                <p className="text-sm font-medium text-amber-100/90">{r.name}
                  <span className="ml-2 text-[11px] font-normal text-zinc-500">
                    {r.createdAt ? new Date(r.createdAt).toLocaleString("id-ID") : ""}
                  </span>
                </p>
                <p className="mt-1 text-sm text-zinc-300">{r.message}</p>
              </div>
            ))}
            {ucapan.length === 0 && <p className="text-sm text-zinc-500">Belum ada ucapan.</p>}
          </div>

          <h2 className="mt-8 text-sm font-semibold uppercase tracking-widest text-zinc-400">
            Konfirmasi kehadiran ({rows.length})
          </h2>
          <div className="mt-3 flex flex-col gap-1.5">
            {rows.map((r, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg border border-zinc-800/60 px-4 py-2 text-sm">
                <span className="text-zinc-200">{r.name ?? "—"}</span>
                <span className={`text-xs ${r.attendance === "hadir" ? "text-emerald-300" : "text-zinc-500"}`}>
                  {r.attendance === "hadir" ? `Hadir × ${r.guestCount || 1}` : "Berhalangan"}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </main>
  );
}
