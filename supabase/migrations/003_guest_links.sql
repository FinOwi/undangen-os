-- Undangen: private guest links (tamu khusus, anti-forward)
-- Cara pakai: jalankan di Supabase SQL Editor (Dashboard > SQL), satu blok.
-- v1: token unik per tamu + device binding via cookie.

create table if not exists public.guest_links (
  id uuid primary key default gen_random_uuid(),
  invitation_id uuid not null references public.invitations(id) on delete cascade,
  token text not null unique,
  guest_name text not null default '',
  created_at timestamptz not null default now(),
  first_opened_at timestamptz,
  device_hash text,
  open_count int not null default 0,
  revoked boolean not null default false
);

create index if not exists guest_links_invitation_idx on public.guest_links(invitation_id);

alter table public.guest_links enable row level security;

-- Admin (login): full, seperti tabel invitations.
drop policy if exists "guest_links authenticated full" on public.guest_links;
create policy "guest_links authenticated full" on public.guest_links
  for all to authenticated using (true) with check (true);

-- Anon: TIDAK ada akses langsung. Validasi hanya lewat fungsi SECURITY DEFINER.

-- Validasi token: kembalikan data tamu bila token valid & undangan published & belum revoked.
create or replace function public.validate_guest_token(p_slug text, p_token text)
returns table (link_id uuid, guest_name text, ok boolean, reason text)
language plpgsql security definer set search_path = public as $$
declare r record;
begin
  select gl.id, gl.guest_name, gl.revoked
    into r
    from public.guest_links gl
    join public.invitations i on i.id = gl.invitation_id
   where i.slug = p_slug
     and gl.token = p_token
     and i.status = 'published';
  if not found then
    return query select null::uuid, ''::text, false, 'not_found'::text;
    return;
  end if;
  if r.revoked then
    return query select r.id, r.guest_name, false, 'revoked'::text;
    return;
  end if;
  return query select r.id, r.guest_name, true, ''::text;
end $$;

-- Catat pembukaan: ikat ke perangkat pertama, tolak perangkat berbeda.
create or replace function public.touch_guest_link(p_link_id uuid, p_device_hash text)
returns text
language plpgsql security definer set search_path = public as $$
declare cur_hash text;
begin
  select device_hash into cur_hash from public.guest_links where id = p_link_id;
  if cur_hash is null then
    update public.guest_links
       set device_hash = p_device_hash,
           first_opened_at = now(),
           open_count = 1
     where id = p_link_id;
    return 'bound';
  elsif cur_hash = p_device_hash then
    update public.guest_links
       set open_count = open_count + 1
     where id = p_link_id;
    return 'ok';
  else
    return 'device_mismatch';
  end if;
end $$;
