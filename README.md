# Simcha OS

Platform internal Simcha — kelola undangan digital model **done-for-you**.
Bukan SaaS self-service: hanya admin (zgg) yang login; pembeli tetap order via WA.

## Arsitektur

- **Next.js 15 + TypeScript + Tailwind** di Vercel
- **Supabase** (project Simcha): Auth + tabel `invitations`
- **Firebase Firestore** (`simcha-rsvp`): backend RSVP/ucapan — dipakai apa adanya
- **Cloudinary**: foto order (unsigned preset, auto-optimasi)
- **21 tema existing** di-render dinamis dari `engine/` — tanpa rewrite React

## Route

| Route | Fungsi |
|---|---|
| `/` | Landing internal → link admin |
| `/admin/login` | Login admin (Supabase Auth) |
| `/admin` | Dashboard |
| `/admin/invitations` | Daftar undangan |
| `/admin/invitations/new` | Builder: buat undangan |
| `/admin/invitations/[id]/edit` | Edit undangan |
| `/i/[slug]` | **Publik**: halaman undangan (render dinamis) |
| `/pantau/[slug]` | **Publik (link privat)**: dashboard RSVP buat mempelai |

## Setup

1. **Supabase**: jalankan `supabase/schema.sql` di SQL Editor. Lalu
   Authentication → Add user → buat akun admin (email + password).
2. **Env** (Vercel → Settings → Environment Variables, atau `.env.local`):
   lihat `.env.example`.
3. **Vercel**: Import repo ini → Deploy. Tambah domain `app.simcha.my.id`
   (DNS: CNAME `app` → `cname.vercel-dns.com`).
4. **Cloudinary**: daftar gratis → Upload preset **Unsigned** bernama
   `simcha_order` → isi env `NEXT_PUBLIC_CLOUDINARY_*`.

## Catatan v1

- RSVP/ucapan tetap di Firebase (sudah live & teruji). Migrasi ke Supabase = v2.
- Moderasi ucapan (hide/show) butuh Firebase Admin SDK = v2.
- Foto: Cloudinary. Bucket Supabase `simcha-photos` tidak dipakai app ini.
