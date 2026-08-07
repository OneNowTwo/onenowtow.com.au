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
