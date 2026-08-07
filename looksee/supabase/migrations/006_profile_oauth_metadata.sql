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
