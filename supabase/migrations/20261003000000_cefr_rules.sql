create table public.score_scale (
  correct smallint primary key check (correct between 0 and 35),
  scaled smallint not null check (scaled between 0 and 75)
);

alter table public.score_scale enable row level security;
revoke all on public.score_scale from anon, authenticated;

insert into public.score_scale (correct, scaled) values
  (0, 0), (1, 3), (2, 5), (3, 7), (4, 9), (5, 11), (6, 13), (7, 15), (8, 17), (9, 19),
  (10, 21), (11, 23), (12, 25), (13, 27), (14, 29), (15, 31), (16, 33), (17, 35), (18, 37), (19, 38),
  (20, 40), (21, 42), (22, 44), (23, 46), (24, 48), (25, 51), (26, 53), (27, 55), (28, 57), (29, 59),
  (30, 62), (31, 65), (32, 67), (33, 70), (34, 72), (35, 75)
on conflict (correct) do update set scaled = excluded.scaled;

create or replace function public.scaled_score(correct integer, total integer)
returns integer
language sql
stable
security definer
set search_path = public
as $$
  select case
    when total = 35 then (select s.scaled from public.score_scale s where s.correct = least(greatest(scaled_score.correct, 0), 35))
    else coalesce(round(75.0 * correct / nullif(total, 0))::integer, 0)
  end;
$$;

create or replace function public.objective_score(parts jsonb, keys jsonb, answers jsonb)
returns integer
language sql
stable
as $$
  with questions as (
    select question ->> 'id' as id
    from jsonb_array_elements(parts) as part,
      jsonb_array_elements(part -> 'questions') as question
  ),
  graded as (
    select exists (
      select 1
      from unnest(string_to_array(keys -> id ->> 'answer', '|')) as accepted
      where public.normalize_answer(answers ->> id) <> ''
        and public.normalize_answer(answers ->> id) = public.normalize_answer(accepted)
    ) as correct
    from questions
  )
  select public.scaled_score((count(*) filter (where correct))::integer, count(*)::integer)
  from graded;
$$;

alter table public.attempts
  add column mode text not null default 'practice' check (mode in ('exam', 'practice'));
