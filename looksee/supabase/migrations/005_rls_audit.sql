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
