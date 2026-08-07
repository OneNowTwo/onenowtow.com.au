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
