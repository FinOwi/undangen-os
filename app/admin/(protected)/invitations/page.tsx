import { createClient } from "@/lib/supabase-server";
import InvitationsList from "./InvitationsList";

export default async function InvitationsPage() {
  const supabase = await createClient();
  const { data: rows } = await supabase
    .from("invitations")
    .select("id, title, slug, theme, status, created_at")
    .order("created_at", { ascending: false });

  const base = process.env.NEXT_PUBLIC_APP_URL ?? "";
  return <InvitationsList rows={rows ?? []} base={base} />;
}
