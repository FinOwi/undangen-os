"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-client";

export interface ThemeOption { slug: string; name: string; }
export interface InvitationInitial {
  id: string; slug: string; theme: string; status: string;
  content: Record<string, any>;
}

const inputCls = "w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm outline-none focus:border-amber-300";
const labelCls = "block text-xs font-medium text-zinc-400";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className={labelCls}>{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-amber-200/80">{title}</h2>
      <div className="grid gap-4 md:grid-cols-2">{children}</div>
    </section>
  );
}

const HARI = ["Minggu","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"];
const BULAN = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];

function fmtDates(dtLocal: string) {
  const dt = new Date(dtLocal);
  const t = dt.getDate(), b = dt.getMonth(), y = dt.getFullYear();
  const rsvp = new Date(dt); rsvp.setDate(rsvp.getDate() - 10);
  const pad = (n: number) => String(n).padStart(2, "0");
  return {
    iso: dt.toISOString(),
    label: `${HARI[dt.getDay()]}, ${t} ${BULAN[b]} ${y}`,
    short: `${pad(t)}.${pad(b + 1)}.${y}`,
    cover: `${t} • ${b + 1} • ${y}`,
    date_rsvp: `${rsvp.getDate()} ${BULAN[rsvp.getMonth()]} ${rsvp.getFullYear()}`,
  };
}

function cloudinaryUrl(url: string) {
  return url.replace("/upload/", "/upload/f_auto,q_auto,w_1600/");
}

export default function InvitationForm({ themes, initial }: { themes: ThemeOption[]; initial?: InvitationInitial }) {
  const router = useRouter();
  const c = initial?.content ?? {};
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [theme, setTheme] = useState(initial?.theme ?? themes[0]?.slug ?? "");
  const [status, setStatus] = useState(initial?.status ?? "draft");
  const [c1, setC1] = useState(c.c1 ?? ""); const [c1full, setC1full] = useState(c.c1full ?? "");
  const [c2, setC2] = useState(c.c2 ?? ""); const [c2full, setC2full] = useState(c.c2full ?? "");
  const [p1, setP1] = useState(c.p1 ?? ""); const [p2, setP2] = useState(c.p2 ?? "");
  const [dt, setDt] = useState("");
  const [venue, setVenue] = useState(c.venue ?? "");
  const [venueAddr, setVenueAddr] = useState(c.venue_addr ?? "");
  const [mapsQ, setMapsQ] = useState(c.maps_q ?? "");
  const [quote, setQuote] = useState(c.quote ?? "");
  const [quoteSrc, setQuoteSrc] = useState(c.quote_src ?? "");
  const [g1bank, setG1bank] = useState(c.gift1_bank ?? "");
  const [g1num, setG1num] = useState(c.gift1_num ?? "");
  const [g1an, setG1an] = useState(c.gift1_an ?? "");
  const [g2bank, setG2bank] = useState(c.gift2_bank ?? "");
  const [g2num, setG2num] = useState(c.gift2_num ?? "");
  const [g2an, setG2an] = useState(c.gift2_an ?? "");
  const [photos, setPhotos] = useState<string[]>(c.gallery ?? []);
  const [uploading, setUploading] = useState(0);
  const [slugMsg, setSlugMsg] = useState("");
  const [err, setErr] = useState("");
  const [saving, setSaving] = useState(false);

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const preset = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET;

  async function checkSlug(v: string) {
    const s = v.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-");
    if (!s) { setSlugMsg(""); return; }
    if (initial && s === initial.slug) { setSlugMsg(""); return; }
    const supabase = createClient();
    const { data } = await supabase.from("invitations").select("id").eq("slug", s).maybeSingle();
    setSlugMsg(data ? "❌ Slug sudah dipakai" : "✅ Slug tersedia");
  }

  async function onFiles(files: FileList | null) {
    if (!files || !files.length) return;
    if (!cloudName || !preset) { setErr("Upload Cloudinary belum dikonfigurasi (env). Minta bow set dulu."); return; }
    if (photos.length + files.length > 30) { setErr("Maksimal 30 foto."); return; }
    setErr("");
    const s = slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-") || "tanpa-slug";
    setUploading((u) => u + files.length);
    for (const f of Array.from(files)) {
      try {
        const fd = new FormData();
        fd.append("file", f);
        fd.append("upload_preset", preset);
        fd.append("folder", `simcha/${s}`);
        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method: "POST", body: fd });
        const j = await res.json();
        if (!res.ok) throw new Error(j?.error?.message || "upload gagal");
        setPhotos((p) => [...p, cloudinaryUrl(j.secure_url)]);
      } catch (e: any) { setErr("Upload gagal: " + e.message); }
      finally { setUploading((u) => u - 1); }
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    const s = slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-");
    if (!s) { setErr("Slug wajib diisi."); return; }
    if (!c1 || !c1full || !c2 || !c2full) { setErr("Nama mempelai wajib diisi."); return; }
    if (!dt && !initial) { setErr("Tanggal acara wajib diisi."); return; }
    if (!venue) { setErr("Venue wajib diisi."); return; }
    if (!g1bank || !g1num) { setErr("Rekening gift 1 wajib diisi."); return; }
    if (photos.length === 0) { setErr("Upload minimal 1 foto (jadi cover)."); return; }

    setSaving(true);
    try {
      const dates = dt ? fmtDates(dt) : { iso: c.iso, label: c.label, short: c.short, cover: c.cover, date_rsvp: c.date_rsvp };
      const content = {
        c1, c1full, c2, c2full, p1, p2, venue,
        venue_addr: venueAddr, maps_q: mapsQ || venue,
        ...dates,
        quote, quote_src: quoteSrc,
        gift1_bank: g1bank, gift1_num: g1num, gift1_an: g1an || `a.n. ${c1full}`,
        gift2_bank: g2bank, gift2_num: g2num, gift2_an: g2an || (g2bank ? `a.n. ${c2full}` : ""),
        gallery: photos,
      };
      const supabase = createClient();
      const title = `${c1} & ${c2}`;
      if (initial) {
        const { error } = await supabase.from("invitations")
          .update({ slug: s, theme, status, title, content,
            published_at: status === "published" ? new Date().toISOString() : null })
          .eq("id", initial.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("invitations")
          .insert({ slug: s, theme, status, title, content,
            published_at: status === "published" ? new Date().toISOString() : null });
        if (error) throw error;
      }
      router.push("/admin/invitations");
      router.refresh();
    } catch (e: any) { setErr("Gagal menyimpan: " + e.message); }
    finally { setSaving(false); }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <Section title="Dasar">
        <Field label="Slug (jadi URL undangan)">
          <input className={inputCls} value={slug}
            onChange={(e) => setSlug(e.target.value)} onBlur={(e) => checkSlug(e.target.value)}
            placeholder="budi-ani" />
          {slugMsg && <p className="mt-1 text-xs text-zinc-400">{slugMsg}</p>}
        </Field>
        <Field label="Tema">
          <select className={inputCls} value={theme} onChange={(e) => setTheme(e.target.value)}>
            {themes.map((t) => <option key={t.slug} value={t.slug}>{t.name}</option>)}
          </select>
        </Field>
        <Field label="Status">
          <select className={inputCls} value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </Field>
      </Section>

      <Section title="Mempelai">
        <Field label="Nama panggilan mempelai 1"><input className={inputCls} value={c1} onChange={(e) => setC1(e.target.value)} placeholder="Budi" /></Field>
        <Field label="Nama lengkap mempelai 1"><input className={inputCls} value={c1full} onChange={(e) => setC1full(e.target.value)} placeholder="Budi Santoso" /></Field>
        <Field label="Nama panggilan mempelai 2"><input className={inputCls} value={c2} onChange={(e) => setC2(e.target.value)} placeholder="Ani" /></Field>
        <Field label="Nama lengkap mempelai 2"><input className={inputCls} value={c2full} onChange={(e) => setC2full(e.target.value)} placeholder="Ani Wijaya" /></Field>
        <Field label="Orang tua mempelai 1"><input className={inputCls} value={p1} onChange={(e) => setP1(e.target.value)} placeholder="Bpk. … & Ibu …" /></Field>
        <Field label="Orang tua mempelai 2"><input className={inputCls} value={p2} onChange={(e) => setP2(e.target.value)} placeholder="Bpk. … & Ibu …" /></Field>
      </Section>

      <Section title="Acara">
        <Field label={`Tanggal & jam${initial ? " (kosongkan jika tidak berubah)" : ""}`}>
          <input type="datetime-local" className={inputCls} value={dt} onChange={(e) => setDt(e.target.value)} />
          {initial && !dt && <p className="mt-1 text-xs text-zinc-500">Saat ini: {c.label}</p>}
        </Field>
        <Field label="Venue"><input className={inputCls} value={venue} onChange={(e) => setVenue(e.target.value)} placeholder="Gedung Serbaguna" /></Field>
        <Field label="Alamat venue"><input className={inputCls} value={venueAddr} onChange={(e) => setVenueAddr(e.target.value)} placeholder="Jl. …" /></Field>
        <Field label="Kata kunci maps"><input className={inputCls} value={mapsQ} onChange={(e) => setMapsQ(e.target.value)} placeholder="otomatis = venue" /></Field>
      </Section>

      <Section title="Foto (maks 30 — foto pertama = cover)">
        <div className="md:col-span-2">
          <input type="file" accept="image/*" multiple onChange={(e) => onFiles(e.target.files)}
            className="block w-full text-sm text-zinc-400 file:mr-3 file:rounded-full file:border-0 file:bg-amber-300 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-zinc-900" />
          {uploading > 0 && <p className="mt-2 text-xs text-amber-200">Mengupload {uploading} foto…</p>}
          <div className="mt-3 grid grid-cols-4 gap-2 md:grid-cols-6">
            {photos.map((u, i) => (
              <div key={u + i} className="group relative aspect-square overflow-hidden rounded-lg border border-zinc-700">
                <img src={u} alt="" className="h-full w-full object-cover" loading="lazy" />
                {i === 0 && <span className="absolute left-1 top-1 rounded bg-amber-300 px-1.5 py-0.5 text-[10px] font-bold text-zinc-900">COVER</span>}
                <button type="button" onClick={() => setPhotos((p) => p.filter((_, j) => j !== i))}
                  className="absolute right-1 top-1 rounded-full bg-red-950/90 px-2 py-0.5 text-[11px] text-red-200 opacity-0 group-hover:opacity-100">✕</button>
              </div>
            ))}
          </div>
          <p className="mt-2 text-xs text-zinc-500">{photos.length}/30 foto</p>
        </div>
      </Section>

      <Section title="Kutipan & Amplop Digital">
        <Field label="Kutipan (opsional)"><input className={inputCls} value={quote} onChange={(e) => setQuote(e.target.value)} /></Field>
        <Field label="Sumber kutipan"><input className={inputCls} value={quoteSrc} onChange={(e) => setQuoteSrc(e.target.value)} /></Field>
        <Field label="Bank gift 1"><input className={inputCls} value={g1bank} onChange={(e) => setG1bank(e.target.value)} placeholder="BCA" /></Field>
        <Field label="No. rekening gift 1"><input className={inputCls} value={g1num} onChange={(e) => setG1num(e.target.value)} placeholder="1234567890" /></Field>
        <Field label="a.n. gift 1"><input className={inputCls} value={g1an} onChange={(e) => setG1an(e.target.value)} placeholder="otomatis" /></Field>
        <div />
        <Field label="Bank gift 2 (opsional)"><input className={inputCls} value={g2bank} onChange={(e) => setG2bank(e.target.value)} /></Field>
        <Field label="No. rekening gift 2"><input className={inputCls} value={g2num} onChange={(e) => setG2num(e.target.value)} /></Field>
        <Field label="a.n. gift 2"><input className={inputCls} value={g2an} onChange={(e) => setG2an(e.target.value)} /></Field>
      </Section>

      {err && <p className="rounded-xl bg-red-950/60 px-4 py-3 text-sm text-red-300">{err}</p>}

      <button disabled={saving || uploading > 0}
        className="rounded-full bg-amber-300 py-3 text-sm font-semibold text-zinc-900 hover:bg-amber-200 disabled:opacity-50">
        {saving ? "Menyimpan…" : initial ? "Simpan Perubahan" : "Buat Undangan"}
      </button>
    </form>
  );
}
