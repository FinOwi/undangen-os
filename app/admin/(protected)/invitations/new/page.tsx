import { loadEngine } from "@/lib/render";
import { STATIC_TEMPLATES } from "@/lib/templates";
import InvitationForm, { type ThemeOption } from "../InvitationForm";

export default async function NewInvitationPage({
  searchParams,
}: {
  searchParams: Promise<{ template?: string }>;
}) {
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

  const { template } = await searchParams;
  const valid = list.some((t) => t.slug === template);

  return <InvitationForm themes={list} defaultTheme={valid ? template : undefined} heading="Buat Undangan Baru" />;
}
