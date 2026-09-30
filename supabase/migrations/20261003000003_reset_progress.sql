create policy "Recordings are removable by owner" on storage.objects
for delete to authenticated
using (bucket_id = 'recordings' and (storage.foldername(name))[1] = (select auth.uid())::text);

create or replace function public.reset_progress()
returns text[]
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := auth.uid();
  recording_paths text[];
begin
  if uid is null then
    raise exception 'not_authenticated';
  end if;

  select coalesce(array_agg(path.value), '{}')
  into recording_paths
  from public.attempts a,
    jsonb_each_text(a.recordings) as path
  where a.user_id = uid;

  delete from public.notifications n
  where n.user_id = uid and n.kind in ('result', 'aiReview');

  delete from public.attempts a
  where a.user_id = uid;

  return recording_paths;
end;
$$;

revoke all on function public.reset_progress() from public, anon;
grant execute on function public.reset_progress() to authenticated;
