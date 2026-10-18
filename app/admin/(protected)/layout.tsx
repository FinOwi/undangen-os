import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import { AdminSidebar, MobileHeader, MobileTabBar } from "./AdminNav";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-[#0b0d12] text-zinc-100 antialiased">
      <AdminSidebar email={user.email ?? ""} />
      <MobileHeader />
      <div className="md:pl-60">
        <main className="mx-auto w-full max-w-5xl px-4 pb-32 pt-5 md:px-8 md:pb-14 md:pt-8">
          {children}
        </main>
      </div>
      <MobileTabBar />
    </div>
  );
}
