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
