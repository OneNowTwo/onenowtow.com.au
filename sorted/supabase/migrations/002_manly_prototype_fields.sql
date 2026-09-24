-- Sorted V0.3: Manly prototype metadata
alter table public.restaurants
  add column if not exists official_url text,
  add column if not exists verified boolean not null default true,
  add column if not exists dinner_suitable boolean not null default true,
  add column if not exists opening_hours text not null default '';

alter table public.dinner_bundles
  add column if not exists is_concept_bundle boolean not null default true;
