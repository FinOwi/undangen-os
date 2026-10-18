"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-client";
import { getStaticTemplate } from "@/lib/templates";
import GuestManager from "./GuestManager";
import type { ThemeOption, InvitationInitial } from "./types";
import {
  inputCls, Field, SlotBox, PageHeader, Stepper, IconChevron,
  btnPrimary, btnGhost, cardCls,
} from "../ui";

const STEPS = [
  { label: "Dasar" },
  { label: "Isi Undangan" },
  { label: "Foto" },
  { label: "Tamu & Simpan" },
];

function cloudinaryUrl(url: string) {
  return url.replace("/upload/", "/upload/f_auto,q_auto,w_1600/");
}

function Accordion({ title, meta, open, onToggle, children }: {
  title: string; meta?: string; open: boolean; onToggle: () => void; children: React.ReactNode;
}) {
  return (
    <div className={`${cardCls} overflow-hidden`}>
      <button type="button" onClick={onToggle} aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left transition hover:bg-white/[0.02]">
        <span className="min-w-0">
          <span className="block truncate text-sm font-semibold text-zinc-100">{title}</span>
          {meta && <span className="mt-0.5 block text-[11px] text-zinc-500">{meta}</span>}
        </span>
        <span className={`shrink-0 text-zinc-500 transition-transform ${open ? "rotate-180" : ""}`}>
          <IconChevron size={16} />
        </span>
      </button>
      {open && (
        <div className="grid gap-4 border-t border-white/[0.06] px-4 py-4 md:grid-cols-2">
          {children}
        </div>
      )}
    </div>
  );
}

export default function StaticTemplateForm({ themes, initial, templateId, heading }: {
  themes: ThemeOption[]; initial?: InvitationInitial; templateId: string; heading?: string;
}) {
  const router = useRouter();
  const c = initial?.content ?? {};
  const tpl = getStaticTemplate(templateId)!;

  const [step, setStep] = useState(0);
  const [openSec, setOpenSec] = useState<string | null>(() => tpl.fields[0]?.section ?? null);
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

  function cleanSlug() {
    return slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-");
  }

  function goStep(i: number) {
    setStep(i);
    setErr("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function next() {
    if (step === 0 && !cleanSlug()) {
      setErr("Isi slug dulu sebelum lanjut.");
      return;
    }
    goStep(Math.min(step + 1, STEPS.length - 1));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    const s = cleanSlug();
    if (!s) { setErr("Slug wajib diisi."); goStep(0); return; }
    const missing = tpl.fields.filter((fd) => fd.required && !fields[fd.key]?.trim());
    if (missing.length) {
      setErr("Wajib diisi: " + missing.map((m) => m.label).join(", "));
      const sec = sections.find((x) => x.keys.includes(missing[0].key));
      if (sec) setOpenSec(sec.title);
      goStep(1);
      return;
    }

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

  const renderField = (k: string) => {
    const fd = fieldByKey[k];
    return (
      <Field key={k} label={fd.label} required={fd.required}>
        {fd.type === "textarea" ? (
          <textarea className={inputCls} rows={2} value={fields[k] ?? ""}
            placeholder={fd.placeholder} onChange={(e) => setField(k, e.target.value)} />
        ) : fd.type === "datetime" ? (
          <input type="datetime-local" className={inputCls} value={fields[k] ?? ""}
            onChange={(e) => setField(k, e.target.value)} />
        ) : fd.type === "select" ? (
          <select className={inputCls} value={fields[k] ?? fd.def ?? ""}
            onChange={(e) => setField(k, e.target.value)}>
            {(fd.options ?? []).map((op) => (
              <option key={op} value={op}>{op}</option>
            ))}
          </select>
        ) : (
          <input className={inputCls} value={fields[k] ?? ""}
            placeholder={fd.placeholder} onChange={(e) => setField(k, e.target.value)} />
        )}
      </Field>
    );
  };

  const filledCount = (keys: string[]) => {
    const n = keys.filter((k) => fields[k]?.trim()).length;
    return `${n}/${keys.length} terisi`;
  };

  return (
    <form onSubmit={onSubmit}>
      <PageHeader title={heading ?? (initial ? "Edit Undangan" : "Buat Undangan")} subtitle={tpl.name} />

      <div className="mt-4">
        <Stepper steps={STEPS} current={step} onGo={goStep} />
      </div>

      <div className="mt-5">
        {step === 0 && (
          <div className={`${cardCls} grid gap-4 p-4 md:grid-cols-2 md:p-5`}>
            <Field label="Slug (jadi URL undangan)" hint={`undangen.my.id/i/${cleanSlug() || "…"}`}>
              <input className={inputCls} value={slug}
                onChange={(e) => setSlug(e.target.value)} onBlur={(e) => checkSlug(e.target.value)}
                placeholder="bima-sari" autoComplete="off" />
              {slugMsg && <p className="mt-1.5 text-xs text-zinc-400">{slugMsg}</p>}
            </Field>
            <Field label="Template">
              {initial ? (
                <p className="rounded-xl border border-white/10 bg-black/40 px-3.5 py-2.5 text-sm text-zinc-200">
                  {tpl.name} <span className="text-xs text-zinc-500">(terkunci saat edit)</span>
                </p>
              ) : (
                <>
                  <select className={inputCls} value={theme}
                    onChange={(e) => { window.location.href = window.location.pathname + `?template=${e.target.value}`; }}>
                    {themes.map((t) => <option key={t.slug} value={t.slug}>{t.kind === "static" ? "🎮 " : ""}{t.name}</option>)}
                  </select>
                  <p className="mt-1.5 text-[11px] text-zinc-600">Ganti template akan me-reset isian form.</p>
                </>
              )}
            </Field>
            <Field label="Status">
              <select className={inputCls} value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="draft">Draft — belum bisa dibuka tamu</option>
                <option value="published">Published — live untuk tamu</option>
              </select>
            </Field>
          </div>
        )}

        {step === 1 && (
          <div className="flex flex-col gap-3">
            {sections.map((sec) => (
              <Accordion key={sec.title} title={sec.title} meta={filledCount(sec.keys)}
                open={openSec === sec.title}
                onToggle={() => setOpenSec(openSec === sec.title ? null : sec.title)}>
                {sec.keys.map(renderField)}
              </Accordion>
            ))}
          </div>
        )}

        {step === 2 && (
          <div className={`${cardCls} p-4 md:p-5`}>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-zinc-100">Slot foto <span className="font-normal text-zinc-500">· {tpl.photoSlots.length} slot</span></h2>
              <span className="rounded-full bg-white/[0.05] px-3 py-1 text-xs tabular-nums text-zinc-400">{totalPhotos()}/30</span>
            </div>
            <div className="flex flex-col gap-4">
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
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col gap-4">
            <div className={`${cardCls} p-4 md:p-5`}>
              <h2 className="mb-1 text-sm font-semibold text-zinc-100">🔒 Undangan Private</h2>
              <p className="mb-4 text-xs leading-relaxed text-zinc-500">
                Tautan tamu unik anti-forward. Tamu tanpa tautan valid melihat halaman “Tautan Tidak Ditemukan”.
              </p>
              <label className="flex cursor-pointer items-center gap-3 text-sm text-zinc-200">
                <input type="checkbox" checked={isPrivate} onChange={(e) => setIsPrivate(e.target.checked)}
                  className="h-5 w-5 accent-amber-300" />
                Aktifkan tautan tamu private
              </label>
              {isPrivate && initial?.id && (
                <div className="mt-4 border-t border-white/[0.06] pt-4">
                  <GuestManager invitationId={initial.id} slug={slug || initial.slug}
                    couple={`${fields.c1 ?? ""} & ${fields.c2 ?? ""}`.trim() || "mempelai"} />
                </div>
              )}
              {isPrivate && !initial?.id && (
                <p className="mt-3 rounded-xl bg-amber-300/10 px-3.5 py-2.5 text-xs text-amber-200">
                  Simpan undangan dulu, lalu kelola daftar tamu di halaman edit.
                </p>
              )}
            </div>

            <div className={`${cardCls} p-4 md:p-5`}>
              <h2 className="mb-3 text-sm font-semibold text-zinc-100">Ringkasan</h2>
              <dl className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm">
                <dt className="text-zinc-500">Template</dt><dd className="text-right text-zinc-200">{tpl.name}</dd>
                <dt className="text-zinc-500">URL</dt><dd className="truncate text-right text-zinc-200">/i/{cleanSlug() || "…"}</dd>
                <dt className="text-zinc-500">Status</dt><dd className="text-right text-zinc-200">{status === "published" ? "Published" : "Draft"}</dd>
                <dt className="text-zinc-500">Foto</dt><dd className="text-right tabular-nums text-zinc-200">{totalPhotos()}/30</dd>
                <dt className="text-zinc-500">Private</dt><dd className="text-right text-zinc-200">{isPrivate ? "Aktif" : "Nonaktif"}</dd>
              </dl>
            </div>
          </div>
        )}
      </div>

      {err && (
        <p className="mt-4 rounded-xl border border-red-400/20 bg-red-950/50 px-4 py-3 text-sm text-red-300">{err}</p>
      )}

      <div className="sticky bottom-[4.75rem] z-20 mt-6 flex items-center gap-2.5 rounded-2xl border border-white/10 bg-[#14161c]/95 p-2.5 shadow-2xl shadow-black/50 backdrop-blur md:bottom-6">
        {step > 0 ? (
          <button type="button" onClick={() => goStep(step - 1)} className={btnGhost}>← Kembali</button>
        ) : <span className="hidden sm:block w-[104px]" />}
        <span className="flex-1 text-center text-xs tabular-nums text-zinc-500">{step + 1} / {STEPS.length}</span>
        {step < STEPS.length - 1 ? (
          <button type="button" onClick={next} className={btnPrimary}>Lanjut →</button>
        ) : (
          <button type="submit" disabled={saving || uploading > 0} className={btnPrimary}>
            {saving ? "Menyimpan…" : uploading > 0 ? `Upload ${uploading}…` : initial ? "💾 Simpan Perubahan" : "🚀 Buat Undangan"}
          </button>
        )}
      </div>
    </form>
  );
}
