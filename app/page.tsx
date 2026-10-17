import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
      <p className="text-xs uppercase tracking-[0.35em] text-amber-200/60">Undangen</p>
      <h1 className="text-4xl font-semibold text-amber-100">Undangen OS</h1>
      <p className="max-w-md text-sm text-zinc-400">
        Platform internal untuk mengelola undangan digital Undangen.
        Halaman ini bukan untuk publik.
      </p>
      <div className="flex gap-3">
        <Link
          href="/admin"
          className="rounded-full bg-amber-300 px-6 py-2.5 text-sm font-semibold text-zinc-900 hover:bg-amber-200"
        >
          Masuk Panel Admin
        </Link>
        <a
          href="https://undangen.my.id"
          className="rounded-full border border-zinc-700 px-6 py-2.5 text-sm text-zinc-300 hover:border-zinc-500"
        >
          undangen.my.id
        </a>
      </div>
    </main>
  );
}
