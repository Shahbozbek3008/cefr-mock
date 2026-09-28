alter table public.profiles
  add column first_name text check (char_length(first_name) <= 40),
  add column last_name text check (char_length(last_name) <= 40),
  add column avatar_path text;

update public.profiles
set
  first_name = nullif(split_part(btrim(name), ' ', 1), ''),
  last_name = nullif(btrim(substr(btrim(name), length(split_part(btrim(name), ' ', 1)) + 1)), '')
where name is not null;

alter table public.profiles drop column name;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, phone)
  values (new.id, new.raw_user_meta_data ->> 'phone')
  on conflict (id) do nothing;
  return new;
end;
$$;

revoke update on public.profiles from authenticated;
grant update (first_name, last_name, avatar_path, target_level, exam_date, daily_minutes, reminder_enabled, push_token)
on public.profiles to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('avatars', 'avatars', true, 2097152, array['image/jpeg'])
on conflict (id) do update
set public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "Avatars are uploaded by owner" on storage.objects
for insert to authenticated
with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy "Avatars are replaced by owner" on storage.objects
for update to authenticated
using (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy "Avatars are removed by owner" on storage.objects
for delete to authenticated
using (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);
