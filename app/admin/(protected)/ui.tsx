// Primitif UI bersama panel admin — dipakai semua halaman & form.
import React from "react";

/* ---------- token ---------- */
export const inputCls =
  "w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none transition focus:border-amber-300/70 focus:ring-2 focus:ring-amber-300/20";
export const labelCls = "block text-xs font-medium text-zinc-400";
export const fileCls =
  "block w-full cursor-pointer text-sm text-zinc-400 file:mr-3 file:cursor-pointer file:rounded-full file:border-0 file:bg-amber-300 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-zinc-950 hover:file:bg-amber-200";
export const btnPrimary =
  "inline-flex items-center justify-center gap-2 rounded-full bg-amber-300 px-5 py-2.5 text-sm font-semibold text-zinc-950 transition hover:bg-amber-200 active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100";
export const btnGhost =
  "inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-5 py-2.5 text-sm font-medium text-zinc-200 transition hover:border-white/25 hover:bg-white/[0.06] active:scale-[0.98] disabled:opacity-50";
export const btnDanger =
  "inline-flex items-center justify-center gap-1.5 rounded-full px-3 py-1.5 text-xs text-red-400 transition hover:bg-red-950/60 disabled:opacity-50";
export const cardCls = "rounded-2xl border border-white/[0.07] bg-white/[0.02]";

/* ---------- ikon SVG ---------- */
function Svg({ children, size = 18, sw = 1.8 }: { children: React.ReactNode; size?: number; sw?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {children}
    </svg>
  );
}
export const IconDashboard = (p: { size?: number }) => (<Svg {...p}><rect x="3" y="3" width="7" height="9" rx="1.5" /><rect x="14" y="3" width="7" height="5" rx="1.5" /><rect x="14" y="12" width="7" height="9" rx="1.5" /><rect x="3" y="16" width="7" height="5" rx="1.5" /></Svg>);
export const IconCard = (p: { size?: number }) => (<Svg {...p}><rect x="3" y="5" width="18" height="14" rx="2.5" /><path d="M3 10h18" /></Svg>);
export const IconPlus = (p: { size?: number }) => (<Svg {...p}><path d="M12 5v14M5 12h14" /></Svg>);
export const IconSearch = (p: { size?: number }) => (<Svg {...p}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></Svg>);
export const IconEye = (p: { size?: number }) => (<Svg {...p}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></Svg>);
export const IconChart = (p: { size?: number }) => (<Svg {...p}><path d="M3 3v16a2 2 0 0 0 2 2h16" /><path d="M7 14v3M12 9v8M17 5v12" /></Svg>);
export const IconEdit = (p: { size?: number }) => (<Svg {...p}><path d="M17 3a2.8 2.8 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /></Svg>);
export const IconTrash = (p: { size?: number }) => (<Svg {...p}><path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /></Svg>);
export const IconLogout = (p: { size?: number }) => (<Svg {...p}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="m16 17 5-5-5-5M21 12H9" /></Svg>);
export const IconCheck = (p: { size?: number }) => (<Svg {...p}><path d="m4 12.5 5 5L20 6.5" /></Svg>);
export const IconChevron = (p: { size?: number; className?: string }) => (<Svg size={p.size} sw={2}><path d="m6 9 6 6 6-6" /></Svg>);
export const IconX = (p: { size?: number }) => (<Svg {...p}><path d="M18 6 6 18M6 6l12 12" /></Svg>);
export const IconPhoto = (p: { size?: number }) => (<Svg {...p}><rect x="3" y="3" width="18" height="18" rx="2.5" /><circle cx="9" cy="9" r="2" /><path d="m21 15-4.5-4.5L6 21" /></Svg>);
export const IconUsers = (p: { size?: number }) => (<Svg {...p}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8" /></Svg>);
export const IconLink = (p: { size?: number }) => (<Svg {...p}><path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7" /><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7" /></Svg>);
export const IconClock = (p: { size?: number }) => (<Svg {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></Svg>);

/* ---------- komponen ---------- */
export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="min-w-0">
        <h1 className="truncate text-xl font-semibold tracking-tight text-zinc-50 md:text-2xl">{title}</h1>
        {subtitle && <p className="mt-0.5 text-sm text-zinc-500">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function StatCard({ icon, label, value, tint }: { icon: React.ReactNode; label: string; value: number | string; tint: string }) {
  return (
    <div className={`${cardCls} flex items-center gap-3.5 p-4 md:p-5`}>
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${tint}`}>{icon}</div>
      <div className="min-w-0">
        <p className="text-2xl font-semibold tabular-nums text-zinc-50 md:text-3xl">{value}</p>
        <p className="truncate text-xs text-zinc-500">{label}</p>
      </div>
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    published: "bg-emerald-400/10 text-emerald-300 ring-1 ring-emerald-400/25",
    draft: "bg-amber-400/10 text-amber-200 ring-1 ring-amber-400/25",
    archived: "bg-zinc-400/10 text-zinc-500 ring-1 ring-zinc-400/20",
  };
  const label = status === "published" ? "Published" : status === "archived" ? "Arsip" : "Draft";
  return (
    <span className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-[11px] font-medium ${map[status] ?? map.draft}`}>
      {label}
    </span>
  );
}

export function EmptyState({ title, hint, children }: { title: string; hint?: string; children?: React.ReactNode }) {
  return (
    <div className={`${cardCls} flex flex-col items-center px-6 py-12 text-center`}>
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.04] text-zinc-500">
        <IconCard size={22} />
      </div>
      <p className="mt-4 text-sm font-medium text-zinc-200">{title}</p>
      {hint && <p className="mt-1 max-w-xs text-xs text-zinc-500">{hint}</p>}
      {children && <div className="mt-5">{children}</div>}
    </div>
  );
}

export function Field({ label, required, hint, children }: {
  label: string; required?: boolean; hint?: string; children: React.ReactNode;
}) {
  return (
    <label className="block min-w-0">
      <span className={labelCls}>{label}{required && <span className="text-amber-300"> *</span>}</span>
      <div className="mt-1.5">{children}</div>
      {hint && <span className="mt-1 block text-[11px] leading-relaxed text-zinc-600">{hint}</span>}
    </label>
  );
}

export function Section({ title, icon, children, wide }: {
  title: string; icon?: React.ReactNode; children: React.ReactNode; wide?: boolean;
}) {
  return (
    <section className={`${cardCls} p-4 md:p-5`}>
      <h2 className="mb-4 flex items-center gap-2 text-[13px] font-semibold uppercase tracking-widest text-amber-200/80">
        {icon && <span className="text-amber-300/80">{icon}</span>}{title}
      </h2>
      <div className={`grid gap-4 ${wide ? "" : "md:grid-cols-2"}`}>{children}</div>
    </section>
  );
}

export function SlotBox({ title, hint, single, value, values, onClear, onRemove, onFiles }: {
  title: string; hint: string; single?: boolean; value?: string; values?: string[];
  onClear?: () => void; onRemove?: (i: number) => void; onFiles: (f: FileList | null) => void;
}) {
  const list = single ? (value ? [value] : []) : (values ?? []);
  return (
    <div className="rounded-xl border border-white/[0.07] bg-black/30 p-4">
      <p className="text-sm font-semibold text-zinc-100">{title}</p>
      <p className="mt-0.5 text-xs leading-relaxed text-zinc-500">{hint}</p>
      <input type="file" accept="image/*" multiple={!single}
        onChange={(e) => { onFiles(e.target.files); e.target.value = ""; }}
        className={`${fileCls} mt-3`} />
      {list.length > 0 && (
        <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-6">
          {list.map((u, i) => (
            <div key={u + i} className="group relative aspect-square overflow-hidden rounded-lg border border-white/10 bg-zinc-900">
              <img src={u} alt="" className="h-full w-full object-cover" loading="lazy" />
              <button type="button" onClick={() => single ? onClear?.() : onRemove?.(i)}
                className="absolute right-1 top-1 rounded-full bg-black/70 p-1.5 text-red-300 opacity-100 transition hover:bg-red-950 md:opacity-0 md:group-hover:opacity-100"
                aria-label="Hapus foto">
                <IconX size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function Stepper({ steps, current, onGo }: {
  steps: { label: string }[]; current: number; onGo: (i: number) => void;
}) {
  return (
    <div className="sticky top-[57px] z-20 -mx-4 border-b border-white/[0.06] bg-[#0b0d12]/90 px-4 py-3 backdrop-blur md:top-0 md:mx-0 md:rounded-2xl md:border md:px-5">
      <ol className="flex items-center">
        {steps.map((s, i) => {
          const done = i < current, now = i === current;
          return (
            <li key={s.label} className={`flex items-center ${i < steps.length - 1 ? "flex-1" : ""}`}>
              <button type="button" onClick={() => onGo(i)}
                className="group flex items-center gap-2" aria-current={now ? "step" : undefined}>
                <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition
                  ${now ? "bg-amber-300 text-zinc-950" : done ? "bg-emerald-400/20 text-emerald-300" : "bg-white/[0.06] text-zinc-500"}`}>
                  {done ? <IconCheck size={13} /> : i + 1}
                </span>
                <span className={`hidden text-xs font-medium sm:block ${now ? "text-zinc-100" : "text-zinc-500"}`}>{s.label}</span>
              </button>
              {i < steps.length - 1 && (
                <span className={`mx-2 h-px flex-1 sm:mx-3 ${i < current ? "bg-emerald-400/40" : "bg-white/10"}`} />
              )}
            </li>
          );
        })}
      </ol>
      <p className="mt-1.5 text-xs text-zinc-500 sm:hidden">Langkah {current + 1} dari {steps.length}: <span className="text-zinc-200">{steps[current].label}</span></p>
    </div>
  );
}
