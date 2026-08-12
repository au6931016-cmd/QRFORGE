-- ScanGrid database schema (Supabase/Postgres)
--
-- How to use: open your Supabase project -> SQL Editor -> New query,
-- paste this whole file, and click Run. Safe to re-run (uses IF NOT
-- EXISTS / OR REPLACE throughout).
--
-- When new tables/columns are added later for future features, append
-- them below with a dated comment instead of editing history above.

-- ===========================================================================
-- profiles — one row per signed-up user, tracks Pro plan status
-- ===========================================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  plan_tier text not null default 'free' check (plan_tier in ('free', 'pro')),
  safepay_customer_id text,
  safepay_subscription_id text,
  subscription_status text check (
    subscription_status in ('active', 'past_due', 'canceled', 'trialing')
  ),
  plan_expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profiles: read own row" on public.profiles;
create policy "profiles: read own row" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "profiles: update own row" on public.profiles;
create policy "profiles: update own row" on public.profiles
  for update using (auth.uid() = id);

-- Auto-create a profile row whenever a new auth user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Keep updated_at current on every row change.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();

-- ===========================================================================
-- qr_codes — saved QR codes, optionally "dynamic" (editable redirect)
-- ===========================================================================
create table if not exists public.qr_codes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  type text not null,
  name text not null default '',
  form_data jsonb not null,
  customization jsonb not null,
  is_dynamic boolean not null default false,
  short_code text unique,
  destination_url text,
  enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists qr_codes_user_id_idx on public.qr_codes (user_id);

alter table public.qr_codes enable row level security;

drop policy if exists "qr_codes: owner select" on public.qr_codes;
create policy "qr_codes: owner select" on public.qr_codes
  for select using (auth.uid() = user_id);

drop policy if exists "qr_codes: owner insert" on public.qr_codes;
create policy "qr_codes: owner insert" on public.qr_codes
  for insert with check (auth.uid() = user_id);

drop policy if exists "qr_codes: owner update" on public.qr_codes;
create policy "qr_codes: owner update" on public.qr_codes
  for update using (auth.uid() = user_id);

drop policy if exists "qr_codes: owner delete" on public.qr_codes;
create policy "qr_codes: owner delete" on public.qr_codes
  for delete using (auth.uid() = user_id);

-- Intentionally no policy allows anonymous/public reads: the public
-- /r/[shortCode] redirect is resolved server-side with the service-role
-- key, which bypasses RLS by design.

drop trigger if exists qr_codes_set_updated_at on public.qr_codes;
create trigger qr_codes_set_updated_at
  before update on public.qr_codes
  for each row execute procedure public.set_updated_at();

-- 2026-08-12: favorite/starred flag for the account "Favorites" view
alter table public.qr_codes add column if not exists is_favorite boolean not null default false;
create index if not exists qr_codes_user_id_is_favorite_idx
  on public.qr_codes (user_id, is_favorite);

-- ===========================================================================
-- qr_scans — scan event log for dynamic QR codes
-- ===========================================================================
create table if not exists public.qr_scans (
  id bigint generated always as identity primary key,
  qr_code_id uuid not null references public.qr_codes (id) on delete cascade,
  scanned_at timestamptz not null default now(),
  referrer text,
  user_agent text
);

create index if not exists qr_scans_qr_code_id_scanned_at_idx
  on public.qr_scans (qr_code_id, scanned_at);

alter table public.qr_scans enable row level security;

drop policy if exists "qr_scans: owner select" on public.qr_scans;
create policy "qr_scans: owner select" on public.qr_scans
  for select using (
    exists (
      select 1 from public.qr_codes
      where qr_codes.id = qr_scans.qr_code_id
        and qr_codes.user_id = auth.uid()
    )
  );

-- Intentionally no insert policy for anon/authenticated roles: scans are
-- written exclusively via the service-role key from the /r/[shortCode]
-- redirect handler.
