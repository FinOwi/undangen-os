import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import { loadEngine } from "@/lib/render";
import { STATIC_TEMPLATES } from "@/lib/templates";
import InvitationForm, { type ThemeOption, type InvitationInitial } from "../../InvitationForm";

export default async function EditInvitationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("invitations").select("*").eq("id", id).single();
  if (!data) notFound();

  const { themes } = await loadEngine();
  const list: ThemeOption[] = [
    ...((themes ?? [])
      .filter((t) => (t as { slug?: string }).slug)
      .map((t) => ({
        slug: (t as { slug: string }).slug,
        name: (t as { name?: string }).name ?? (t as { slug: string }).slug,
        kind: "engine" as const,
      }))),
    ...STATIC_TEMPLATES.map((t) => ({ slug: t.id, name: t.name, kind: "static" as const })),
  ];

  const initial: InvitationInitial = {
    id: data.id, slug: data.slug, theme: data.theme, status: data.status, content: data.content ?? {},
  };

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-amber-100">Edit: {data.title}</h1>
      <InvitationForm themes={list} initial={initial} />
    </div>
  );
}
