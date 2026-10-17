"use server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase-server";

export async function toggleStatus(id: string, next: "draft" | "published" | "archived") {
  const supabase = await createClient();
  const patch: Record<string, unknown> = { status: next };
  if (next === "published") patch.published_at = new Date().toISOString();
  const { error } = await supabase.from("invitations").update(patch).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
  revalidatePath("/admin/invitations");
}

export async function deleteInvitation(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("invitations").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
  revalidatePath("/admin/invitations");
}
