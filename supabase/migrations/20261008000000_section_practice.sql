alter table public.attempts
  add column scope text not null default 'full'
  check (scope in ('full', 'listening', 'reading', 'writing', 'speaking'));

drop index public.attempts_single_active;
create unique index attempts_single_active on public.attempts (user_id, test_id, scope) where status = 'in_progress';

revoke update on public.attempts from authenticated;
grant update (current_section, completed_sections, answers, flags, writing, recordings, ends_at) on public.attempts to authenticated;

alter table public.results
  add column scope text not null default 'full'
  check (scope in ('full', 'listening', 'reading', 'writing', 'speaking'));

create index results_user_scope_created on public.results (user_id, scope, created_at desc);

create or replace function public.queue_ai_reviews()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.ai_reviews (result_id, user_id, kind)
  select new.id, new.user_id, kind
  from unnest(array['writing', 'speaking']) as kind
  where new.scope in ('full', kind)
  on conflict (result_id, kind) do nothing;
  return new;
end;
$$;

create or replace function public.complete_ai_review(review_id uuid, final_score integer, payload jsonb)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  target public.ai_reviews%rowtype;
  clamped integer := greatest(0, least(75, final_score));
begin
  update public.ai_reviews r
  set status = 'ready', score = clamped, review = payload, error = null
  where r.id = review_id
  returning r.* into target;

  if not found then
    raise exception 'review_not_found' using errcode = 'P0002';
  end if;

  update public.results res
  set
    writing = case when target.kind = 'writing' then clamped else res.writing end,
    speaking = case when target.kind = 'speaking' then clamped else res.speaking end,
    total = case
      when res.scope = 'full' then round((
        res.listening + res.reading
        + case when target.kind = 'writing' then clamped else res.writing end
        + case when target.kind = 'speaking' then clamped else res.speaking end
      ) / 4.0)::integer
      else clamped
    end
  where res.id = target.result_id;

  insert into public.notifications (user_id, kind, params, url)
  values (
    target.user_id,
    'aiReview',
    jsonb_build_object('section', initcap(target.kind)),
    '/result/' || target.result_id || '/' || target.kind
  );
end;
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
  listening_score integer := 0;
  reading_score integer := 0;
  writing_score integer := 0;
  speaking_score integer := 0;
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

  if attempt.scope in ('full', 'listening') then
    listening_score := public.objective_score(test.content -> 'listening', coalesce(answer_keys, '{}'), attempt.answers);
  end if;
  if attempt.scope in ('full', 'reading') then
    reading_score := public.objective_score(test.content -> 'reading', coalesce(answer_keys, '{}'), attempt.answers);
  end if;
  if attempt.scope in ('full', 'writing') then
    writing_score := public.provisional_writing_score(test.content -> 'writing', attempt.writing);
  end if;
  if attempt.scope in ('full', 'speaking') then
    speaking_score := public.provisional_speaking_score(test.content -> 'speaking', attempt.recordings);
  end if;

  total_score := case attempt.scope
    when 'full' then round((listening_score + reading_score + writing_score + speaking_score) / 4.0)::integer
    when 'listening' then listening_score
    when 'reading' then reading_score
    when 'writing' then writing_score
    else speaking_score
  end;

  insert into public.results (
    user_id, attempt_id, test_id, scope, listening, reading, writing, speaking, total, answers, duration_sec
  )
  values (
    current_user_id,
    attempt.id,
    attempt.test_id,
    attempt.scope,
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
  set
    status = 'completed',
    completed_at = now(),
    completed_sections = case
      when attempt.scope = 'full' then array['listening', 'reading', 'writing', 'speaking']
      else array[attempt.scope]
    end
  where a.id = attempt.id;

  insert into public.notifications (user_id, kind, params, url)
  values (
    current_user_id,
    'result',
    jsonb_build_object('title', test.title, 'score', total_score, 'level', public.level_for(total_score), 'scope', attempt.scope),
    '/result/' || result_id
  );

  return result_id;
end;
$$;

revoke execute on function public.submit_attempt(uuid) from public, anon;
grant execute on function public.submit_attempt(uuid) to authenticated;
