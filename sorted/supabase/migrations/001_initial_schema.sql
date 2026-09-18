-- Sorted v0.1 schema
create extension if not exists "pgcrypto";

create table if not exists public.restaurants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text not null default '',
  address text not null default '',
  suburb text not null,
  postcode text not null,
  cuisine text not null,
  image_url text,
  ordering_url text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.dinner_bundles (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  name text not null,
  description text not null default '',
  price numeric(8,2) not null,
  feeds_people integer not null,
  estimated_minutes integer not null,
  image_url text,
  active boolean not null default true,
  available_days text[] not null default array['mon','tue','wed','thu','fri','sat','sun'],
  tags text[] not null default '{}',
  dietary_tags text[] not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists public.household_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  household_name text not null,
  postcode text not null,
  adults integer not null default 2,
  children integer not null default 0,
  dietary_requirements text[] not null default '{}',
  favourite_cuisines text[] not null default '{}',
  avoided_foods text not null default '',
  typical_budget text not null default '60-80',
  created_at timestamptz not null default now()
);

create table if not exists public.recommendation_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  household_id uuid references public.household_profiles(id) on delete set null,
  postcode text not null,
  adults integer not null,
  children integer not null,
  mood_tags text[] not null default '{}',
  budget_min integer,
  budget_max integer,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.recommendation_results (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.recommendation_sessions(id) on delete cascade,
  dinner_bundle_id uuid not null references public.dinner_bundles(id) on delete cascade,
  rank integer not null,
  score numeric(8,2) not null,
  reason text not null,
  selected boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.favourites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  dinner_bundle_id uuid not null references public.dinner_bundles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, dinner_bundle_id)
);

create table if not exists public.waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  feature text not null default 'sorted-3',
  created_at timestamptz not null default now()
);

create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  properties jsonb not null default '{}',
  user_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists dinner_bundles_restaurant_idx on public.dinner_bundles (restaurant_id);
create index if not exists dinner_bundles_active_idx on public.dinner_bundles (active);
create index if not exists restaurants_postcode_idx on public.restaurants (postcode);
create index if not exists household_profiles_user_idx on public.household_profiles (user_id);
create index if not exists recommendation_results_session_idx on public.recommendation_results (session_id);
create index if not exists favourites_user_idx on public.favourites (user_id);

alter table public.restaurants enable row level security;
alter table public.dinner_bundles enable row level security;
alter table public.household_profiles enable row level security;
alter table public.recommendation_sessions enable row level security;
alter table public.recommendation_results enable row level security;
alter table public.favourites enable row level security;
alter table public.waitlist enable row level security;
alter table public.analytics_events enable row level security;

-- Public catalogue: anyone can read active rows.
create policy "restaurants_public_read" on public.restaurants
  for select using (active = true or auth.role() = 'service_role');

create policy "bundles_public_read" on public.dinner_bundles
  for select using (active = true or auth.role() = 'service_role');

-- Households: owners can manage their own rows.
create policy "households_select_own" on public.household_profiles
  for select using (auth.uid() = user_id);

create policy "households_insert_own" on public.household_profiles
  for insert with check (auth.uid() = user_id or user_id is null);

create policy "households_update_own" on public.household_profiles
  for update using (auth.uid() = user_id);

create policy "households_delete_own" on public.household_profiles
  for delete using (auth.uid() = user_id);

-- Recommendation sessions
create policy "sessions_select_own" on public.recommendation_sessions
  for select using (auth.uid() = user_id or user_id is null);

create policy "sessions_insert" on public.recommendation_sessions
  for insert with check (auth.uid() = user_id or user_id is null);

create policy "results_select_via_session" on public.recommendation_results
  for select using (
    exists (
      select 1 from public.recommendation_sessions s
      where s.id = session_id
        and (s.user_id = auth.uid() or s.user_id is null)
    )
  );

create policy "results_insert" on public.recommendation_results
  for insert with check (true);

create policy "results_update_own" on public.recommendation_results
  for update using (
    exists (
      select 1 from public.recommendation_sessions s
      where s.id = session_id and s.user_id = auth.uid()
    )
  );

-- Favourites are strictly user-owned.
create policy "favourites_select_own" on public.favourites
  for select using (auth.uid() = user_id);

create policy "favourites_insert_own" on public.favourites
  for insert with check (auth.uid() = user_id);

create policy "favourites_delete_own" on public.favourites
  for delete using (auth.uid() = user_id);

-- Waitlist: anyone can join; nobody can read emails from the client.
create policy "waitlist_insert" on public.waitlist
  for insert with check (true);

-- Analytics inserts from authenticated or anonymous clients.
create policy "analytics_insert" on public.analytics_events
  for insert with check (true);
