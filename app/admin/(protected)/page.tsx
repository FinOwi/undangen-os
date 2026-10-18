import Link from "next/link";
import { createClient } from "@/lib/supabase-server";
import { templateDisplayName } from "@/lib/templates";
import {
  PageHeader, StatCard, StatusBadge, EmptyState,
  IconDashboard, IconCheck, IconClock, IconCard, IconPlus, IconChevron,
} from "./ui";

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
      <PageHeader
        title="Dashboard"
        subtitle="Ringkasan semua undanganmu"
        action={
          <Link href="/admin/invitations/new"
            className="inline-flex items-center gap-2 rounded-full bg-amber-300 px-5 py-2.5 text-sm font-semibold text-zinc-950 transition hover:bg-amber-200 active:scale-[0.98]">
            <IconPlus size={16} /> Buat Undangan
          </Link>
        }
      />

      <div className="mt-5 grid grid-cols-3 gap-2.5 md:gap-4">
        <StatCard icon={<IconCard size={20} />} label="Total undangan" value={list.length} tint="bg-amber-300/10 text-amber-300" />
        <StatCard icon={<IconCheck size={20} />} label="Published" value={published} tint="bg-emerald-400/10 text-emerald-300" />
        <StatCard icon={<IconClock size={20} />} label="Draft" value={draft} tint="bg-zinc-400/10 text-zinc-300" />
      </div>

      <div className="mt-8 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-zinc-300">
          <IconDashboard size={16} /> Terbaru
        </h2>
        <Link href="/admin/invitations" className="flex items-center gap-1 text-xs font-medium text-amber-300/90 hover:text-amber-200">
          Lihat semua <IconChevron size={14} />
        </Link>
      </div>

      <div className="mt-3 flex flex-col gap-2">
        {list.slice(0, 5).map((r) => (
          <Link key={r.id} href="/admin/invitations"
            className="group flex items-center justify-between gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.02] px-4 py-3.5 transition hover:border-white/[0.14] hover:bg-white/[0.04]">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-zinc-100">{r.title}</p>
              <p className="mt-0.5 truncate text-xs text-zinc-500">
                undangen.my.id/i/{r.slug} · {templateDisplayName(r.theme)}
              </p>
            </div>
            <StatusBadge status={r.status} />
          </Link>
        ))}
        {list.length === 0 && (
          <EmptyState title="Belum ada undangan" hint="Buat undangan pertamamu — pilih template, isi data, publish.">
            <Link href="/admin/invitations/new"
              className="inline-flex items-center gap-2 rounded-full bg-amber-300 px-5 py-2.5 text-sm font-semibold text-zinc-950 hover:bg-amber-200">
              <IconPlus size={16} /> Buat yang pertama
            </Link>
          </EmptyState>
        )}
      </div>
    </div>
  );
}
