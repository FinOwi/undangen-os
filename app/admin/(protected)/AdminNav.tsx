"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "../LogoutButton";
import { IconDashboard, IconCard, IconPlus, IconLogout } from "./ui";

const NAV = [
  { href: "/admin", label: "Dashboard", Icon: IconDashboard, exact: true },
  { href: "/admin/invitations", label: "Undangan", Icon: IconCard },
  { href: "/admin/invitations/new", label: "Buat", Icon: IconPlus },
];

function isActive(path: string, href: string, exact?: boolean) {
  if (href === "/admin/invitations/new") return path === href;
  return exact ? path === href : path.startsWith(href);
}

export function AdminSidebar({ email }: { email: string }) {
  const path = usePathname();
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-white/[0.06] bg-black/50 backdrop-blur md:flex">
      <div className="flex items-center gap-2.5 px-5 pb-6 pt-7">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-300 text-lg font-bold text-zinc-950">U</span>
        <div>
          <p className="text-sm font-semibold tracking-wide text-zinc-100">Undangen OS</p>
          <p className="text-[11px] text-zinc-500">Panel admin</p>
        </div>
      </div>
      <nav className="flex flex-col gap-1 px-3">
        {NAV.map((n) => {
          const on = isActive(path, n.href, n.exact);
          return (
            <Link key={n.href} href={n.href}
              className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition
                ${on ? "bg-amber-300/10 text-amber-200" : "text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-100"}`}>
              <n.Icon size={18} />
              {n.label}
              {on && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-amber-300" />}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto border-t border-white/[0.06] p-4">
        <p className="truncate px-1 text-xs text-zinc-500">{email}</p>
        <div className="mt-2.5 flex items-center gap-2 text-zinc-400">
          <IconLogout size={15} />
          <LogoutButton />
        </div>
      </div>
    </aside>
  );
}

export function MobileHeader() {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/[0.06] bg-[#0b0d12]/90 px-4 py-3 backdrop-blur md:hidden">
      <div className="flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-300 text-sm font-bold text-zinc-950">U</span>
        <p className="text-sm font-semibold tracking-wide text-zinc-100">Undangen OS</p>
      </div>
      <LogoutButton />
    </header>
  );
}

export function MobileTabBar() {
  const path = usePathname();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-white/[0.08] bg-[#0e1015]/95 backdrop-blur md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
      <div className="grid grid-cols-3 px-6 pb-2 pt-1.5">
        {NAV.map((n) => {
          const on = isActive(path, n.href, n.exact);
          const fab = n.href === "/admin/invitations/new";
          return (
            <Link key={n.href} href={n.href}
              className={`flex flex-col items-center gap-1 py-1.5 text-[10px] font-medium transition ${on ? "text-amber-300" : "text-zinc-500"}`}>
              {fab ? (
                <span className={`flex h-11 w-11 items-center justify-center rounded-full transition ${on ? "bg-amber-300 text-zinc-950" : "bg-white/[0.07] text-zinc-200"}`}>
                  <n.Icon size={20} />
                </span>
              ) : (
                <n.Icon size={21} />
              )}
              {!fab && n.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
