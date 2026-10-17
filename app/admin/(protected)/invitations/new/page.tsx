import { loadEngine } from "@/lib/render";
import InvitationForm, { type ThemeOption } from "../InvitationForm";

export default async function NewInvitationPage() {
  const { themes } = await loadEngine();
  const list: ThemeOption[] = (themes ?? [])
    .filter((t) => (t as { slug?: string }).slug)
    .map((t) => ({ slug: (t as { slug: string }).slug, name: (t as { name?: string }).name ?? (t as { slug: string }).slug }));

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-amber-100">Buat Undangan Baru</h1>
      <InvitationForm themes={list} />
    </div>
  );
}
