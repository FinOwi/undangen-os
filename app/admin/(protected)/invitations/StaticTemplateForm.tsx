"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-client";
import { getStaticTemplate } from "@/lib/templates";
import GuestManager from "./GuestManager";
import type { ThemeOption, InvitationInitial } from "./types";

const inputCls = "w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm outline-none focus:border-amber-300";
const labelCls = "block text-xs font-medium text-zinc-400";
const fileCls = "block w-full text-sm text-zinc-400 file:mr-3 file:rounded-full file:border-0 file:bg-amber-300 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-zinc-900";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className={labelCls}>{label}{/* required ditandai di label */}</span>
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
function SlotBox({ title, hint, single, value, values, onClear, onRemove, onFiles }: {
  title: string; hint: string; single?: boolean; value?: string; values?: string[];
  onClear?: () => void; onRemove?: (i: number) => void; onFiles: (f: FileList | null) => void;
}) {
  const list = single ? (value ? [value] : []) : (values ?? []);
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4">
      <p className="text-sm font-semibold text-zinc-100">{title}</p>
      <p className="mt-0.5 text-xs text-zinc-500">{hint}</p>
      <input type="file" accept="image/*" multiple={!single} onChange={(e) => { onFiles(e.target.files); e.target.value = ""; }}
        className={`${fileCls} mt-3`} />
      {list.length > 0 && (
        <div className="mt-3 grid grid-cols-4 gap-2 md:grid-cols-6">
          {list.map((u, i) => (
            <div key={u + i} className="group relative aspect-square overflow-hidden rounded-lg border border-zinc-700">
              <img src={u} alt="" className="h-full w-full object-cover" loading="lazy" />
              <button type="button" onClick={() => single ? onClear?.() : onRemove?.(i)}
                className="absolute right-1 top-1 rounded-full bg-red-950/90 px-2 py-0.5 text-[11px] text-red-200 opacity-0 group-hover:opacity-100">✕</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function cloudinaryUrl(url: string) {
  return url.replace("/upload/", "/upload/f_auto,q_auto,w_1600/");
}

export default function StaticTemplateForm({ themes, initial, templateId }: {
  themes: ThemeOption[]; initial?: InvitationInitial; templateId: string;
}) {
  const router = useRouter();
  const c = initial?.content ?? {};
  const tpl = getStaticTemplate(templateId)!;

  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [theme, setTheme] = useState(templateId);
  const [status, setStatus] = useState(initial?.status ?? "draft");
  const [fields, setFields] = useState<Record<string, string>>(() => {
    const f: Record<string, string> = {};
    for (const fd of tpl.fields) f[fd.key] = c[fd.key] ?? fd.def ?? "";
    return f;
  });
  const [photos, setPhotos] = useState<Record<string, string | string[]>>(() => {
    const p: Record<string, string | string[]> = {};
    for (const s of tpl.photoSlots) {
      const v = c[s.key];
      p[s.key] = s.max === 1 ? (typeof v === "string" ? v : "") : (Array.isArray(v) ? v : (typeof v === "string" && v ? [v] : []));
    }
    return p;
  });
  const [isPrivate, setIsPrivate] = useState(c.private === true);
  const [uploading, setUploading] = useState(0);
  const [slugMsg, setSlugMsg] = useState("");
  const [err, setErr] = useState("");
  const [saving, setSaving] = useState(false);

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const preset = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET;

  const totalPhotos = () => Object.entries(photos).reduce((n, [k, v]) => {
    const slot = tpl.photoSlots.find((s) => s.key === k);
    return n + (slot && slot.max === 1 ? (v ? 1 : 0) : (v as string[]).length);
  }, 0);

  async function checkSlug(v: string) {
    const s = v.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-");
    if (!s) { setSlugMsg(""); return; }
    if (initial && s === initial.slug) { setSlugMsg(""); return; }
    const supabase = createClient();
    const { data } = await supabase.from("invitations").select("id").eq("slug", s).maybeSingle();
    setSlugMsg(data ? "❌ Slug sudah dipakai" : "✅ Slug tersedia");
  }

  async function onFiles(files: FileList | null, slotKey: string, max: number) {
    if (!files || !files.length) return;
    if (!cloudName || !preset) { setErr("Upload Cloudinary belum dikonfigurasi (env). Minta bow set dulu."); return; }
    const cur = photos[slotKey];
    const curCount = max === 1 ? (cur ? 1 : 0) : (cur as string[]).length;
    const room = max - curCount;
    if (room <= 0) { setErr(`Slot ini maksimal ${max} foto.`); return; }
    if (totalPhotos() + files.length > 30) { setErr("Maksimal 30 foto total."); return; }
    setErr("");
    const s = slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-") || "tanpa-slug";
    const take = Array.from(files).slice(0, max === 1 ? 1 : room);
    setUploading((u) => u + take.length);
    for (const f of take) {
      try {
        const fd = new FormData();
        fd.append("file", f);
        fd.append("upload_preset", preset);
        fd.append("folder", `undangen/${s}`);
        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method: "POST", body: fd });
        const j = await res.json();
        if (!res.ok) throw new Error(j?.error?.message || "upload gagal");
        const url = cloudinaryUrl(j.secure_url);
        setPhotos((p) => ({
          ...p,
          [slotKey]: max === 1 ? url : [...(p[slotKey] as string[]), url],
        }));
      } catch (e: any) { setErr("Upload gagal: " + e.message); }
      finally { setUploading((u) => u - 1); }
    }
  }

  function setField(key: string, v: string) {
    setFields((f) => ({ ...f, [key]: v }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    const s = slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-");
    if (!s) { setErr("Slug wajib diisi."); return; }
    const missing = tpl.fields.filter((fd) => fd.required && !fields[fd.key]?.trim());
    if (missing.length) { setErr("Wajib diisi: " + missing.map((m) => m.label).join(", ")); return; }

    setSaving(true);
    try {
      const content = { ...fields, ...photos, private: isPrivate };
      const supabase = createClient();
      const title = `${fields.c1 ?? ""} & ${fields.c2 ?? ""}`.trim();
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

  // Kelompokkan field per section, urutan sesuai registry
  const sections: { title: string; keys: string[] }[] = [];
  for (const fd of tpl.fields) {
    let sec = sections.find((x) => x.title === fd.section);
    if (!sec) { sec = { title: fd.section, keys: [] }; sections.push(sec); }
    sec.keys.push(fd.key);
  }
  const fieldByKey = Object.fromEntries(tpl.fields.map((fd) => [fd.key, fd]));

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <Section title="Dasar">
        <Field label="Slug (jadi URL undangan)">
          <input className={inputCls} value={slug}
            onChange={(e) => setSlug(e.target.value)} onBlur={(e) => checkSlug(e.target.value)}
            placeholder="bima-sari" />
          {slugMsg && <p className="mt-1 text-xs text-zinc-400">{slugMsg}</p>}
        </Field>
        <Field label="Template">
          {initial ? (
            <p className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-200">
              🎮 {tpl.name} <span className="text-xs text-zinc-500">(terkunci saat edit)</span>
            </p>
          ) : (
            <select className={inputCls} value={theme}
              onChange={(e) => {
                window.location.href = window.location.pathname + `?template=${e.target.value}`;
              }}>
              {themes.map((t) => <option key={t.slug} value={t.slug}>{t.kind === "static" ? "🎮 " : ""}{t.name}</option>)}
            </select>
          )}
          {!initial && <p className="mt-1 text-xs text-zinc-500">Ganti template akan me-reset isian form.</p>}
        </Field>
        <Field label="Status">
          <select className={inputCls} value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </Field>
      </Section>

      {sections.map((sec) => (
        <Section key={sec.title} title={sec.title}>
          {sec.keys.map((k) => {
            const fd = fieldByKey[k];
            return (
              <Field key={k} label={fd.label + (fd.required ? " *" : "")}>
                {fd.type === "textarea" ? (
                  <textarea className={inputCls} rows={2} value={fields[k] ?? ""}
                    placeholder={fd.placeholder} onChange={(e) => setField(k, e.target.value)} />
                ) : fd.type === "datetime" ? (
                  <input type="datetime-local" className={inputCls} value={fields[k] ?? ""}
                    onChange={(e) => setField(k, e.target.value)} />
                ) : (
                  <input className={inputCls} value={fields[k] ?? ""}
                    placeholder={fd.placeholder} onChange={(e) => setField(k, e.target.value)} />
                )}
              </Field>
            );
          })}
        </Section>
      ))}

      <Section title={`Foto — urutan ${tpl.photoSlots.length} slot`}>
        <div className="md:col-span-2 flex flex-col gap-5">
          {tpl.photoSlots.map((s) => (
            <SlotBox key={s.key} title={s.label} hint={`${s.hint}${s.max > 1 ? ` · maks ${s.max}` : ""}`}
              single={s.max === 1}
              value={s.max === 1 ? (photos[s.key] as string) : undefined}
              values={s.max === 1 ? undefined : (photos[s.key] as string[])}
              onClear={() => setPhotos((p) => ({ ...p, [s.key]: "" }))}
              onRemove={(i) => setPhotos((p) => ({ ...p, [s.key]: (p[s.key] as string[]).filter((_, j) => j !== i) }))}
              onFiles={(f) => onFiles(f, s.key, s.max)} />
          ))}
          {uploading > 0 && <p className="text-xs text-amber-200">Mengupload {uploading} foto…</p>}
          <p className="text-xs text-zinc-500">{totalPhotos()}/30 foto terisi</p>
        </div>
      </Section>

      <Section title="Undangan Private 🔒">
        <div className="md:col-span-2">
          <label className="flex cursor-pointer items-center gap-3 text-sm text-zinc-200">
            <input type="checkbox" checked={isPrivate} onChange={(e) => setIsPrivate(e.target.checked)}
              className="h-4 w-4 accent-amber-300" />
            Aktifkan tautan tamu private (anti-forward, per tamu 1 tautan unik)
          </label>
        </div>
        {isPrivate && initial?.id && (
          <GuestManager invitationId={initial.id} slug={slug || initial.slug}
            couple={`${fields.c1 ?? ""} & ${fields.c2 ?? ""}`.trim() || "mempelai"} />
        )}
        {isPrivate && !initial?.id && (
          <p className="text-xs text-amber-200 md:col-span-2">Simpan undangan dulu, lalu kelola daftar tamu di sini.</p>
        )}
      </Section>

      {err && <p className="rounded-xl bg-red-950/60 px-4 py-3 text-sm text-red-300">{err}</p>}

      <button disabled={saving || uploading > 0}
        className="rounded-full bg-amber-300 py-3 text-sm font-semibold text-zinc-900 hover:bg-amber-200 disabled:opacity-50">
        {saving ? "Menyimpan…" : initial ? "Simpan Perubahan" : "Buat Undangan"}
      </button>
    </form>
  );
}
