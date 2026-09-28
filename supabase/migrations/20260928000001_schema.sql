create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  phone text unique,
  name text check (char_length(name) <= 60),
  target_level text check (target_level in ('B1', 'B2', 'C1')),
  exam_date date,
  daily_minutes smallint check (daily_minutes in (15, 30, 45, 60)),
  reminder_enabled boolean not null default true,
  push_token text,
  is_pro boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, phone, name)
  values (new.id, new.raw_user_meta_data ->> 'phone', new.raw_user_meta_data ->> 'name')
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create table public.otp_requests (
  id uuid primary key default gen_random_uuid(),
  phone text not null,
  code_hash text not null,
  attempts smallint not null default 0,
  expires_at timestamptz not null,
  consumed_at timestamptz,
  created_at timestamptz not null default now()
);

create index otp_requests_phone_created on public.otp_requests (phone, created_at desc);

create table public.tests (
  id text primary key,
  number integer not null unique,
  title text not null,
  format_month smallint not null check (format_month between 0 and 11),
  format_year smallint not null,
  duration_label text not null default '2:45',
  is_new boolean not null default false,
  is_free boolean not null default true,
  is_pro boolean not null default false,
  content jsonb not null,
  published_at timestamptz not null default now()
);

create table public.test_keys (
  test_id text primary key references public.tests (id) on delete cascade,
  keys jsonb not null
);

create table public.attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  test_id text not null references public.tests (id),
  status text not null default 'in_progress' check (status in ('in_progress', 'completed')),
  current_section text check (current_section in ('listening', 'reading', 'writing', 'speaking')),
  completed_sections text[] not null default '{}',
  answers jsonb not null default '{}',
  flags text[] not null default '{}',
  writing jsonb not null default '{}',
  recordings jsonb not null default '{}',
  ends_at jsonb not null default '{}',
  started_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz
);

create unique index attempts_single_active on public.attempts (user_id, test_id) where status = 'in_progress';
create index attempts_user on public.attempts (user_id, updated_at desc);

create trigger attempts_updated_at
before update on public.attempts
for each row execute function public.set_updated_at();

create table public.results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  attempt_id uuid not null unique references public.attempts (id) on delete cascade,
  test_id text not null references public.tests (id),
  listening smallint not null,
  reading smallint not null,
  writing smallint not null,
  speaking smallint not null,
  total smallint not null,
  answers jsonb not null,
  duration_sec integer not null,
  created_at timestamptz not null default now()
);

create index results_user_created on public.results (user_id, created_at desc);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  kind text not null check (kind in ('result', 'aiReview', 'reminder', 'newTest', 'exam')),
  params jsonb not null default '{}',
  url text,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create index notifications_user_created on public.notifications (user_id, created_at desc);

alter table public.profiles enable row level security;
alter table public.otp_requests enable row level security;
alter table public.tests enable row level security;
alter table public.test_keys enable row level security;
alter table public.attempts enable row level security;
alter table public.results enable row level security;
alter table public.notifications enable row level security;

create policy "Profiles are readable by owner" on public.profiles
for select to authenticated using (id = (select auth.uid()));

create policy "Profiles are editable by owner" on public.profiles
for update to authenticated using (id = (select auth.uid())) with check (id = (select auth.uid()));

revoke insert, update, delete on public.profiles from anon, authenticated;
grant update (name, target_level, exam_date, daily_minutes, reminder_enabled, push_token)
on public.profiles to authenticated;

revoke all on public.otp_requests from anon, authenticated;

create policy "Tests are readable by signed in users" on public.tests
for select to authenticated using (true);

revoke insert, update, delete on public.tests from anon, authenticated;

create policy "Keys are readable after finishing the test" on public.test_keys
for select to authenticated using (
  exists (
    select 1 from public.results r
    where r.test_id = test_keys.test_id and r.user_id = (select auth.uid())
  )
);

revoke insert, update, delete on public.test_keys from anon, authenticated;

create policy "Attempts are readable by owner" on public.attempts
for select to authenticated using (user_id = (select auth.uid()));

create policy "Attempts can be started on available tests" on public.attempts
for insert to authenticated with check (
  user_id = (select auth.uid())
  and status = 'in_progress'
  and exists (
    select 1 from public.tests t
    where t.id = test_id
      and (
        not t.is_pro
        or exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.is_pro)
      )
  )
);

create policy "Active attempts are editable by owner" on public.attempts
for update to authenticated
using (user_id = (select auth.uid()) and status = 'in_progress')
with check (user_id = (select auth.uid()) and status = 'in_progress');

revoke delete on public.attempts from anon, authenticated;

create policy "Results are readable by owner" on public.results
for select to authenticated using (user_id = (select auth.uid()));

revoke insert, update, delete on public.results from anon, authenticated;

create policy "Notifications are readable by owner" on public.notifications
for select to authenticated using (user_id = (select auth.uid()));

create policy "Notifications are editable by owner" on public.notifications
for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

create policy "Notifications are removable by owner" on public.notifications
for delete to authenticated using (user_id = (select auth.uid()));

revoke insert, update on public.notifications from anon, authenticated;
grant update (read) on public.notifications to authenticated;

create or replace function public.normalize_answer(value text)
returns text
language sql
immutable
as $$
  select regexp_replace(lower(btrim(coalesce(value, ''))), '\s+', ' ', 'g');
$$;

create or replace function public.level_for(score integer)
returns text
language sql
immutable
as $$
  select case
    when score >= 65 then 'C1'
    when score >= 51 then 'B2'
    when score >= 38 then 'B1'
    else 'A2'
  end;
$$;

create or replace function public.objective_score(parts jsonb, keys jsonb, answers jsonb)
returns integer
language sql
immutable
as $$
  with questions as (
    select question ->> 'id' as id
    from jsonb_array_elements(parts) as part,
      jsonb_array_elements(part -> 'questions') as question
  )
  select coalesce(
    round(
      75.0 * count(*) filter (
        where public.normalize_answer(answers ->> id) <> ''
          and public.normalize_answer(answers ->> id) = public.normalize_answer(keys -> id ->> 'answer')
      ) / nullif(count(*), 0)
    )::integer,
    0
  )
  from questions;
$$;

create or replace function public.provisional_writing_score(tasks jsonb, writing jsonb)
returns integer
language sql
immutable
as $$
  with coverage as (
    select least(
      1.0,
      coalesce(array_length(regexp_split_to_array(nullif(btrim(writing ->> (task ->> 'id')), ''), '\s+'), 1), 0)
        / greatest((task ->> 'targetWords')::numeric, 1)
    ) as ratio
    from jsonb_array_elements(tasks) as task
  )
  select coalesce(round(60 * avg(ratio))::integer, 0) from coverage;
$$;

create or replace function public.provisional_speaking_score(questions jsonb, recordings jsonb)
returns integer
language sql
immutable
as $$
  select coalesce(
    round(60.0 * count(*) filter (where recordings ? (question ->> 'id')) / nullif(count(*), 0))::integer,
    0
  )
  from jsonb_array_elements(questions) as question;
$$;

create or replace function public.submit_attempt(attempt_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  attempt public.attempts%rowtype;
  test public.tests%rowtype;
  answer_keys jsonb;
  listening_score integer;
  reading_score integer;
  writing_score integer;
  speaking_score integer;
  total_score integer;
  result_id uuid;
begin
  if current_user_id is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;

  select * into attempt
  from public.attempts a
  where a.id = submit_attempt.attempt_id and a.user_id = current_user_id
  for update;

  if not found then
    raise exception 'attempt_not_found' using errcode = 'P0002';
  end if;

  if attempt.status = 'completed' then
    select r.id into result_id from public.results r where r.attempt_id = attempt.id;
    return result_id;
  end if;

  select * into test from public.tests t where t.id = attempt.test_id;
  select k.keys into answer_keys from public.test_keys k where k.test_id = attempt.test_id;

  listening_score := public.objective_score(test.content -> 'listening', coalesce(answer_keys, '{}'), attempt.answers);
  reading_score := public.objective_score(test.content -> 'reading', coalesce(answer_keys, '{}'), attempt.answers);
  writing_score := public.provisional_writing_score(test.content -> 'writing', attempt.writing);
  speaking_score := public.provisional_speaking_score(test.content -> 'speaking', attempt.recordings);
  total_score := round((listening_score + reading_score + writing_score + speaking_score) / 4.0)::integer;

  insert into public.results (
    user_id, attempt_id, test_id, listening, reading, writing, speaking, total, answers, duration_sec
  )
  values (
    current_user_id,
    attempt.id,
    attempt.test_id,
    listening_score,
    reading_score,
    writing_score,
    speaking_score,
    total_score,
    attempt.answers,
    greatest(0, extract(epoch from now() - attempt.started_at))::integer
  )
  returning id into result_id;

  update public.attempts a
  set status = 'completed', completed_at = now(), completed_sections = array['listening', 'reading', 'writing', 'speaking']
  where a.id = attempt.id;

  insert into public.notifications (user_id, kind, params, url)
  values (
    current_user_id,
    'result',
    jsonb_build_object('title', test.title, 'score', total_score, 'level', public.level_for(total_score)),
    '/result/' || result_id
  );

  return result_id;
end;
$$;

revoke execute on function public.submit_attempt(uuid) from public, anon;
grant execute on function public.submit_attempt(uuid) to authenticated;
