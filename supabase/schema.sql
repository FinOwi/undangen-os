-- ============================================================
-- Undangen OS — schema Supabase
-- Jalankan di Supabase Dashboard → SQL Editor (project Simcha)
-- ============================================================

-- ---------- profiles ----------
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  role text not null default 'admin',
  created_at timestamptz not null default now()
);

-- ---------- invitations ----------
create table if not exists invitations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete set null,
  title text not null,
  slug text not null unique,
  theme text not null,
  status text not null default 'draft'
    check (status in ('draft','published','archived')),
  -- content: JSONB berisi seluruh data order (c1, c1full, ..., gallery urls, gift, quote)
  -- format identik dengan order.json pipeline agar render 1:1
  content jsonb not null default '{}'::jsonb,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists invitations_slug_idx on invitations(slug);
create index if not exists invitations_status_idx on invitations(status);

-- updated_at otomatis
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;
drop trigger if exists trg_invitations_updated on invitations;
create trigger trg_invitations_updated
  before update on invitations for each row execute function set_updated_at();

-- ============================================================
-- Row Level Security
-- - Publik (anon): hanya boleh BACA undangan published
-- - Admin (login): boleh semua (hanya zgg yg punya akun)
-- ============================================================
alter table profiles enable row level security;
alter table invitations enable row level security;

drop policy if exists "profiles_admin_all" on profiles;
create policy "profiles_admin_all" on profiles
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "invitations_public_read" on invitations;
create policy "invitations_public_read" on invitations
  for select using (status = 'published');

drop policy if exists "invitations_admin_all" on invitations;
create policy "invitations_admin_all" on invitations
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
