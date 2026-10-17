import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import LogoutButton from "../LogoutButton";

const NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/invitations", label: "Undangan" },
  { href: "/admin/invitations/new", label: "+ Buat Baru" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-56 shrink-0 flex-col border-r border-zinc-800/80 bg-zinc-950/60 p-5 md:flex">
        <p className="text-xs uppercase tracking-[0.3em] text-amber-200/60">Simcha OS</p>
        <nav className="mt-8 flex flex-col gap-1">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href}
              className="rounded-lg px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800/70 hover:text-amber-100">
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto pt-6">
          <p className="truncate text-xs text-zinc-500">{user.email}</p>
          <div className="mt-2"><LogoutButton /></div>
        </div>
      </aside>
      <div className="min-w-0 flex-1">
        <header className="flex items-center justify-between border-b border-zinc-800/80 px-5 py-3 md:hidden">
          <p className="text-xs uppercase tracking-[0.3em] text-amber-200/60">Simcha OS</p>
          <LogoutButton />
        </header>
        <nav className="flex gap-1 overflow-x-auto border-b border-zinc-800/80 px-4 py-2 md:hidden">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href}
              className="whitespace-nowrap rounded-full border border-zinc-800 px-3 py-1.5 text-xs text-zinc-300">
              {n.label}
            </Link>
          ))}
        </nav>
        <main className="mx-auto max-w-5xl p-5 md:p-8">{children}</main>
      </div>
    </div>
  );
}
