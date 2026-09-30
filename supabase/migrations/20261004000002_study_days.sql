create table public.study_days (
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  day date not null,
  minutes integer not null default 0 check (minutes between 0 and 1440),
  primary key (user_id, day)
);

alter table public.study_days enable row level security;

create policy "Study days are readable by owner" on public.study_days
for select to authenticated using (user_id = (select auth.uid()));

revoke insert, update, delete on public.study_days from anon, authenticated;

create or replace function public.log_study(study_day date, spent_minutes integer)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := auth.uid();
begin
  if uid is null then
    raise exception 'not_authenticated';
  end if;

  if spent_minutes < 1 or spent_minutes > 240 or abs(study_day - current_date) > 1 then
    raise exception 'invalid_study_entry';
  end if;

  insert into public.study_days (user_id, day, minutes)
  values (uid, study_day, spent_minutes)
  on conflict (user_id, day) do update
  set minutes = least(1440, public.study_days.minutes + excluded.minutes);
end;
$$;

revoke all on function public.log_study(date, integer) from public, anon;
grant execute on function public.log_study(date, integer) to authenticated;

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

  delete from public.study_days s
  where s.user_id = uid;

  delete from public.attempts a
  where a.user_id = uid;

  return recording_paths;
end;
$$;
