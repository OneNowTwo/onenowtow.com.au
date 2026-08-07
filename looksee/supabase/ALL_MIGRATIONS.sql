-- Looksee ALL migrations (001 → 006), combined for one-shot SQL Editor run
-- Generated for local/MVP setup. Safe to re-run only on empty schema (create type/table will fail if already applied).
-- Note: table is video_reports (not reports).


-- =============================================================================
-- FILE: supabase/migrations/001_initial_schema.sql
-- =============================================================================

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


-- =============================================================================
-- FILE: supabase/migrations/002_rls_policies.sql
-- =============================================================================

-- Row Level Security policies

alter table public.profiles enable row level security;
alter table public.destinations enable row level security;
alter table public.hostels enable row level security;
alter table public.videos enable row level security;
alter table public.ratings enable row level security;
alter table public.helpful_votes enable row level security;
alter table public.saved_hostels enable row level security;
alter table public.points_transactions enable row level security;
alter table public.hostel_suggestions enable row level security;
alter table public.video_reports enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

-- Profiles
create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using (true);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (
    auth.uid() = id
    and role = (select role from public.profiles where id = auth.uid())
    and points_balance = (select points_balance from public.profiles where id = auth.uid())
  );

create policy "Admins can update any profile"
  on public.profiles for update
  using (public.is_admin());

-- Destinations
create policy "Active destinations are public"
  on public.destinations for select
  using (active = true or public.is_admin());

create policy "Admins manage destinations"
  on public.destinations for all
  using (public.is_admin())
  with check (public.is_admin());

-- Hostels
create policy "Active hostels are public"
  on public.hostels for select
  using (active = true or public.is_admin());

create policy "Admins manage hostels"
  on public.hostels for all
  using (public.is_admin())
  with check (public.is_admin());

-- Videos
create policy "Approved videos are public"
  on public.videos for select
  using (
    status = 'approved'
    or user_id = auth.uid()
    or public.is_admin()
  );

create policy "Users can insert own videos"
  on public.videos for insert
  with check (auth.uid() = user_id and status in ('pending', 'processing'));

create policy "Users can update own pending videos"
  on public.videos for update
  using (auth.uid() = user_id and status in ('pending', 'processing'))
  with check (auth.uid() = user_id);

create policy "Admins manage videos"
  on public.videos for all
  using (public.is_admin())
  with check (public.is_admin());

-- Ratings
create policy "Ratings are public"
  on public.ratings for select
  using (true);

create policy "Users can insert own ratings"
  on public.ratings for insert
  with check (auth.uid() = user_id);

create policy "Users can update own ratings"
  on public.ratings for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Admins manage ratings"
  on public.ratings for all
  using (public.is_admin())
  with check (public.is_admin());

-- Helpful votes
create policy "Helpful votes are public"
  on public.helpful_votes for select
  using (true);

create policy "Users can insert own helpful votes"
  on public.helpful_votes for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own helpful votes"
  on public.helpful_votes for delete
  using (auth.uid() = user_id);

-- Saved hostels
create policy "Users can view own saves"
  on public.saved_hostels for select
  using (auth.uid() = user_id or public.is_admin());

create policy "Users can save hostels"
  on public.saved_hostels for insert
  with check (auth.uid() = user_id);

create policy "Users can unsave hostels"
  on public.saved_hostels for delete
  using (auth.uid() = user_id);

-- Points transactions (read-only for users; writes via service role / admin)
create policy "Users can view own points history"
  on public.points_transactions for select
  using (auth.uid() = user_id or public.is_admin());

create policy "Only admins can insert points"
  on public.points_transactions for insert
  with check (public.is_admin());

-- Hostel suggestions
create policy "Users can view own suggestions"
  on public.hostel_suggestions for select
  using (auth.uid() = user_id or public.is_admin());

create policy "Users can create suggestions"
  on public.hostel_suggestions for insert
  with check (auth.uid() = user_id);

create policy "Admins manage suggestions"
  on public.hostel_suggestions for update
  using (public.is_admin());

-- Video reports
create policy "Users can view own reports"
  on public.video_reports for select
  using (auth.uid() = reporter_id or public.is_admin());

create policy "Users can create reports"
  on public.video_reports for insert
  with check (auth.uid() = reporter_id);

create policy "Admins manage reports"
  on public.video_reports for update
  using (public.is_admin());


-- =============================================================================
-- FILE: supabase/migrations/003_video_upload_lifecycle.sql
-- =============================================================================

-- Phase 3: expand video processing lifecycle for Mux uploads

alter type public.video_status add value if not exists 'uploading';
alter type public.video_status add value if not exists 'ready';
alter type public.video_status add value if not exists 'errored';

alter table public.videos
  add column if not exists error_message text,
  add column if not exists submitted_at timestamptz;

-- Allow creators to insert uploading/processing rows (status still cannot be approved by users)
drop policy if exists "Users can insert own videos" on public.videos;
create policy "Users can insert own videos"
  on public.videos for insert
  with check (
    auth.uid() = user_id
    and status in ('uploading', 'processing', 'pending')
  );

drop policy if exists "Users can update own pending videos" on public.videos;
create policy "Users can update own upload metadata"
  on public.videos for update
  using (
    auth.uid() = user_id
    and status in ('uploading', 'processing', 'ready', 'pending', 'errored')
  )
  with check (
    auth.uid() = user_id
    and status in ('uploading', 'processing', 'ready', 'pending', 'errored')
  );


-- =============================================================================
-- FILE: supabase/migrations/004_mvp_points_aggregates.sql
-- =============================================================================

-- Phase 4 MVP: hidden videos, idempotent points, aggregates helpers

alter type public.video_status add value if not exists 'hidden';

create unique index if not exists points_transactions_unique_award
  on public.points_transactions (user_id, type, reference_id)
  where reference_id is not null
    and type in (
      'video_approved',
      'helpful_10',
      'helpful_50',
      'first_upload_bonus'
    );

create unique index if not exists video_reports_unique_open
  on public.video_reports (reporter_id, video_id, reason)
  where status = 'open';

create or replace function public.recalculate_hostel_aggregates(p_hostel_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count integer;
begin
  select count(*)::integer into v_count
  from public.videos
  where hostel_id = p_hostel_id
    and status = 'approved';

  update public.hostels h
  set
    video_count = coalesce(v_count, 0),
    avg_cleanliness = sub.avg_cleanliness,
    avg_sleep = sub.avg_sleep,
    avg_social = sub.avg_social,
    avg_security = sub.avg_security,
    avg_location = sub.avg_location,
    avg_overall = sub.avg_overall,
    avg_vibe_score = sub.avg_vibe_score,
    updated_at = now()
  from (
    select
      round(avg(r.cleanliness)::numeric, 2) as avg_cleanliness,
      round(avg(r.sleep)::numeric, 2) as avg_sleep,
      round(avg(r.social)::numeric, 2) as avg_social,
      round(avg(r.security)::numeric, 2) as avg_security,
      round(avg(r.location)::numeric, 2) as avg_location,
      round(
        (
          avg(r.cleanliness) + avg(r.sleep) + avg(r.social) + avg(r.security) + avg(r.location)
        ) / 5.0,
        1
      ) as avg_overall,
      round(avg(r.vibe_score)::numeric, 2) as avg_vibe_score
    from public.ratings r
    inner join public.videos v on v.id = r.video_id
    where r.hostel_id = p_hostel_id
      and v.status = 'approved'
  ) sub
  where h.id = p_hostel_id;
end;
$$;

create or replace function public.award_points(
  p_user_id uuid,
  p_amount integer,
  p_type public.points_type,
  p_reference_id uuid,
  p_description text
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  if exists (
    select 1
    from public.points_transactions
    where user_id = p_user_id
      and type = p_type
      and reference_id = p_reference_id
  ) then
    return false;
  end if;

  insert into public.points_transactions (user_id, amount, type, reference_id, description)
  values (p_user_id, p_amount, p_type, p_reference_id, p_description);

  update public.profiles
  set points_balance = points_balance + p_amount,
      updated_at = now()
  where id = p_user_id;

  return true;
exception
  when unique_violation then
    return false;
end;
$$;

create or replace function public.sync_video_helpful_count()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    update public.videos
    set helpful_count = helpful_count + 1
    where id = new.video_id;
    return new;
  elsif tg_op = 'DELETE' then
    update public.videos
    set helpful_count = greatest(helpful_count - 1, 0)
    where id = old.video_id;
    return old;
  end if;
  return null;
end;
$$;

drop trigger if exists helpful_votes_sync_count on public.helpful_votes;
create trigger helpful_votes_sync_count
  after insert or delete on public.helpful_votes
  for each row execute function public.sync_video_helpful_count();

create or replace function public.maybe_award_helpful_thresholds(p_video_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v public.videos;
begin
  select * into v from public.videos where id = p_video_id;
  if not found then
    return;
  end if;

  if v.helpful_count >= 10 then
    perform public.award_points(
      v.user_id, 25, 'helpful_10', v.id, 'Video helped 10 travellers'
    );
  end if;

  if v.helpful_count >= 50 then
    perform public.award_points(
      v.user_id, 50, 'helpful_50', v.id, 'Video helped 50 travellers'
    );
  end if;
end;
$$;

create or replace function public.admin_approve_video(p_video_id uuid, p_admin_id uuid)
returns public.videos
language plpgsql
security definer
set search_path = public
as $$
declare
  v public.videos;
  prior_approved integer;
begin
  if not exists (
    select 1 from public.profiles where id = p_admin_id and role = 'admin'
  ) then
    raise exception 'Not authorised';
  end if;

  select * into v from public.videos where id = p_video_id for update;
  if not found then
    raise exception 'Video not found';
  end if;

  if v.mux_playback_id is null then
    raise exception 'Video has no playback ID yet';
  end if;

  if v.status = 'approved' then
    return v;
  end if;

  if v.status not in ('pending', 'ready') then
    raise exception 'Video cannot be approved from status %', v.status;
  end if;

  update public.videos
  set status = 'approved',
      approved_at = now(),
      approved_by = p_admin_id,
      error_message = null
  where id = p_video_id
  returning * into v;

  perform public.award_points(
    v.user_id, 100, 'video_approved', v.id, 'Hostel video approved'
  );

  select count(*)::integer into prior_approved
  from public.videos
  where user_id = v.user_id
    and status = 'approved'
    and id <> v.id;

  if prior_approved = 0 then
    perform public.award_points(
      v.user_id, 100, 'first_upload_bonus', v.id, 'First Looksee bonus'
    );
  end if;

  perform public.recalculate_hostel_aggregates(v.hostel_id);

  return v;
end;
$$;

create or replace function public.admin_reject_video(
  p_video_id uuid,
  p_admin_id uuid,
  p_reason text default null
)
returns public.videos
language plpgsql
security definer
set search_path = public
as $$
declare
  v public.videos;
begin
  if not exists (
    select 1 from public.profiles where id = p_admin_id and role = 'admin'
  ) then
    raise exception 'Not authorised';
  end if;

  select * into v from public.videos where id = p_video_id for update;
  if not found then
    raise exception 'Video not found';
  end if;

  if v.status = 'rejected' then
    return v;
  end if;

  update public.videos
  set status = 'rejected',
      rejected_reason = p_reason,
      approved_at = null,
      approved_by = null
  where id = p_video_id
  returning * into v;

  return v;
end;
$$;

grant execute on function public.recalculate_hostel_aggregates(uuid) to service_role;
grant execute on function public.award_points(uuid, integer, public.points_type, uuid, text) to service_role;
grant execute on function public.admin_approve_video(uuid, uuid) to authenticated, service_role;
grant execute on function public.admin_reject_video(uuid, uuid, text) to authenticated, service_role;
grant execute on function public.maybe_award_helpful_thresholds(uuid) to service_role;


-- =============================================================================
-- FILE: supabase/migrations/005_rls_audit.sql
-- =============================================================================

-- Phase 4 RLS audit + refinements

-- Profiles: travellers cannot escalate role or points (already constrained); allow insert only via trigger
drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (
    auth.uid() = id
    and role = (select p.role from public.profiles p where p.id = auth.uid())
    and points_balance = (select p.points_balance from public.profiles p where p.id = auth.uid())
  );

-- Videos: public only approved (not hidden); owners see own; admins see all
drop policy if exists "Approved videos are public" on public.videos;
create policy "Approved videos are public"
  on public.videos for select
  using (
    status = 'approved'
    or user_id = auth.uid()
    or public.is_admin()
  );

-- Users must not set approved/rejected/hidden themselves on insert
drop policy if exists "Users can insert own videos" on public.videos;
create policy "Users can insert own videos"
  on public.videos for insert
  with check (
    auth.uid() = user_id
    and status in ('uploading', 'processing', 'pending')
  );

drop policy if exists "Users can update own upload metadata" on public.videos;
create policy "Users can update own upload metadata"
  on public.videos for update
  using (
    auth.uid() = user_id
    and status in ('uploading', 'processing', 'ready', 'pending', 'errored')
  )
  with check (
    auth.uid() = user_id
    and status in ('uploading', 'processing', 'ready', 'pending', 'errored')
    and status <> 'approved'
    and status <> 'rejected'
    and status <> 'hidden'
  );

-- Helpful: cannot vote on own video (enforced in app + check via trigger optional)
create or replace function public.prevent_self_helpful()
returns trigger
language plpgsql
as $$
begin
  if exists (
    select 1 from public.videos v
    where v.id = new.video_id and v.user_id = new.user_id
  ) then
    raise exception 'Cannot mark your own video helpful';
  end if;
  if not exists (
    select 1 from public.videos v
    where v.id = new.video_id and v.status = 'approved'
  ) then
    raise exception 'Only approved videos can receive helpful votes';
  end if;
  return new;
end;
$$;

drop trigger if exists helpful_votes_prevent_self on public.helpful_votes;
create trigger helpful_votes_prevent_self
  before insert on public.helpful_votes
  for each row execute function public.prevent_self_helpful();

-- After helpful insert, try thresholds
create or replace function public.helpful_after_insert_awards()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.maybe_award_helpful_thresholds(new.video_id);
  return new;
end;
$$;

drop trigger if exists helpful_votes_award_thresholds on public.helpful_votes;
create trigger helpful_votes_award_thresholds
  after insert on public.helpful_votes
  for each row execute function public.helpful_after_insert_awards();

-- Ratings: only for own user; public read of ratings that belong to approved videos preferred in app
drop policy if exists "Users can insert own ratings" on public.ratings;
create policy "Users can insert own ratings"
  on public.ratings for insert
  with check (auth.uid() = user_id);

-- Destinations/hostels: admins manage (already); ensure authenticated travellers cannot update
-- (covered by admin-only policies)

-- Reports: already have insert/select; admins manage update
drop policy if exists "Admins manage reports" on public.video_reports;
create policy "Admins manage reports"
  on public.video_reports for all
  using (public.is_admin())
  with check (public.is_admin());


-- =============================================================================
-- FILE: supabase/migrations/006_profile_oauth_metadata.sql
-- =============================================================================

-- Improve profile bootstrap from OAuth metadata
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  full_name text;
  given_name text;
begin
  full_name := coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name');
  given_name := coalesce(
    new.raw_user_meta_data ->> 'given_name',
    new.raw_user_meta_data ->> 'first_name',
    split_part(coalesce(full_name, ''), ' ', 1),
    split_part(new.email, '@', 1)
  );

  insert into public.profiles (id, email, first_name, avatar_url)
  values (
    new.id,
    new.email,
    nullif(given_name, ''),
    coalesce(
      new.raw_user_meta_data ->> 'avatar_url',
      new.raw_user_meta_data ->> 'picture'
    )
  )
  on conflict (id) do nothing;

  return new;
end;
$$;


-- =============================================================================
-- VERIFICATION (safe read-only checks; run as part of the same script)
-- =============================================================================

select
  t.tablename,
  t.rowsecurity as rls_enabled
from pg_tables t
where t.schemaname = 'public'
  and t.tablename in (
    'profiles',
    'destinations',
    'hostels',
    'videos',
    'ratings',
    'helpful_votes',
    'saved_hostels',
    'points_transactions',
    'hostel_suggestions',
    'video_reports'
  )
order by t.tablename;

-- Simple public read probe (destinations should be empty but queryable)
select count(*) as destination_count from public.destinations;
