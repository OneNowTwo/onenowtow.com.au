-- Looksee initial schema
-- Run via Supabase CLI or SQL editor

create extension if not exists "pgcrypto";

create type public.user_role as enum ('traveller', 'admin');
create type public.video_status as enum ('pending', 'processing', 'approved', 'rejected');
create type public.video_category as enum (
  'dorm',
  'bed',
  'bathroom',
  'kitchen',
  'common_area',
  'social_nightlife',
  'private_room',
  'other'
);
create type public.suggestion_status as enum ('pending', 'approved', 'rejected');
create type public.report_reason as enum (
  'inaccurate_misleading',
  'offensive',
  'privacy',
  'commercial_promotional',
  'wrong_hostel',
  'other'
);
create type public.report_status as enum ('open', 'reviewed', 'dismissed', 'actioned');
create type public.points_type as enum (
  'video_approved',
  'helpful_10',
  'helpful_50',
  'first_upload_bonus',
  'admin_adjustment',
  'redemption'
);

-- Profiles (extends auth.users)
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  first_name text,
  avatar_url text,
  nationality text,
  current_city text,
  role public.user_role not null default 'traveller',
  points_balance integer not null default 0 check (points_balance >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.destinations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  country text not null,
  description text,
  hero_image_url text,
  latitude double precision,
  longitude double precision,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.hostels (
  id uuid primary key default gen_random_uuid(),
  destination_id uuid not null references public.destinations (id) on delete restrict,
  name text not null,
  slug text not null unique,
  description text,
  address text,
  latitude double precision,
  longitude double precision,
  hero_image_url text,
  hostelworld_url text,
  booking_url text,
  direct_url text,
  preferred_booking_url text,
  price_from_aud integer,
  active boolean not null default true,
  -- Cached aggregates (updated on approval)
  avg_cleanliness numeric(3, 2),
  avg_sleep numeric(3, 2),
  avg_social numeric(3, 2),
  avg_security numeric(3, 2),
  avg_location numeric(3, 2),
  avg_overall numeric(3, 2),
  avg_vibe_score numeric(5, 2),
  video_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index hostels_destination_id_idx on public.hostels (destination_id);
create index hostels_active_idx on public.hostels (active) where active = true;

create table public.videos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  hostel_id uuid not null references public.hostels (id) on delete cascade,
  mux_upload_id text,
  mux_asset_id text,
  mux_playback_id text,
  placeholder_video_url text,
  placeholder_poster_url text,
  category public.video_category not null,
  caption text check (char_length(caption) <= 180),
  status public.video_status not null default 'pending',
  filmed_at date not null,
  helpful_count integer not null default 0,
  created_at timestamptz not null default now(),
  approved_at timestamptz,
  approved_by uuid references public.profiles (id),
  rejected_reason text
);

create index videos_hostel_id_idx on public.videos (hostel_id);
create index videos_status_idx on public.videos (status);
create index videos_user_id_idx on public.videos (user_id);
create index videos_filmed_at_idx on public.videos (filmed_at desc);

create table public.ratings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  hostel_id uuid not null references public.hostels (id) on delete cascade,
  video_id uuid references public.videos (id) on delete set null,
  cleanliness smallint not null check (cleanliness between 1 and 5),
  sleep smallint not null check (sleep between 1 and 5),
  social smallint not null check (social between 1 and 5),
  security smallint not null check (security between 1 and 5),
  location smallint not null check (location between 1 and 5),
  vibe_score smallint not null check (vibe_score between 0 and 100),
  created_at timestamptz not null default now(),
  unique (user_id, hostel_id, video_id)
);

create index ratings_hostel_id_idx on public.ratings (hostel_id);

create table public.helpful_votes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  video_id uuid not null references public.videos (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, video_id)
);

create table public.saved_hostels (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  hostel_id uuid not null references public.hostels (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, hostel_id)
);

create table public.points_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  amount integer not null,
  type public.points_type not null,
  reference_id uuid,
  description text not null,
  created_at timestamptz not null default now()
);

create index points_transactions_user_id_idx on public.points_transactions (user_id);

create table public.hostel_suggestions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  destination text not null,
  notes text,
  status public.suggestion_status not null default 'pending',
  created_at timestamptz not null default now()
);

create table public.video_reports (
  id uuid primary key default gen_random_uuid(),
  video_id uuid not null references public.videos (id) on delete cascade,
  reporter_id uuid not null references public.profiles (id) on delete cascade,
  reason public.report_reason not null,
  details text,
  status public.report_status not null default 'open',
  created_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewed_by uuid references public.profiles (id)
);

create index video_reports_status_idx on public.video_reports (status);

-- updated_at trigger
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

create trigger hostels_set_updated_at
  before update on public.hostels
  for each row execute function public.set_updated_at();

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, first_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'first_name', new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
