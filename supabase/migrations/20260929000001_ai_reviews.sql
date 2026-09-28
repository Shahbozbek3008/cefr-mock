insert into storage.buckets (id, name, public)
values ('recordings', 'recordings', false)
on conflict (id) do nothing;

create policy "Recordings are uploaded by owner" on storage.objects
for insert to authenticated
with check (bucket_id = 'recordings' and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy "Recordings are replaced by owner" on storage.objects
for update to authenticated
using (bucket_id = 'recordings' and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy "Recordings are readable by owner" on storage.objects
for select to authenticated
using (bucket_id = 'recordings' and (storage.foldername(name))[1] = (select auth.uid())::text);

create table public.ai_reviews (
  id uuid primary key default gen_random_uuid(),
  result_id uuid not null references public.results (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  kind text not null check (kind in ('writing', 'speaking')),
  status text not null default 'pending' check (status in ('pending', 'processing', 'ready', 'failed')),
  score smallint,
  review jsonb,
  error text,
  runs smallint not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (result_id, kind)
);

create index ai_reviews_user on public.ai_reviews (user_id, created_at desc);

create trigger ai_reviews_updated_at
before update on public.ai_reviews
for each row execute function public.set_updated_at();

alter table public.ai_reviews enable row level security;

create policy "AI reviews are readable by owner" on public.ai_reviews
for select to authenticated using (user_id = (select auth.uid()));

revoke insert, update, delete on public.ai_reviews from anon, authenticated;

create or replace function public.queue_ai_reviews()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.ai_reviews (result_id, user_id, kind)
  values (new.id, new.user_id, 'writing'), (new.id, new.user_id, 'speaking')
  on conflict (result_id, kind) do nothing;
  return new;
end;
$$;

create trigger results_queue_ai_reviews
after insert on public.results
for each row execute function public.queue_ai_reviews();

create or replace function public.claim_ai_reviews(target_result uuid)
returns setof public.ai_reviews
language sql
security definer
set search_path = public
as $$
  update public.ai_reviews r
  set status = 'processing', runs = r.runs + 1, error = null
  where r.result_id = target_result
    and r.runs < 5
    and (
      r.status in ('pending', 'failed')
      or (r.status = 'processing' and r.updated_at < now() - interval '5 minutes')
    )
  returning r.*;
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
    total = round((
      res.listening + res.reading
      + case when target.kind = 'writing' then clamped else res.writing end
      + case when target.kind = 'speaking' then clamped else res.speaking end
    ) / 4.0)::integer
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

create or replace function public.fail_ai_review(review_id uuid, reason text)
returns void
language sql
security definer
set search_path = public
as $$
  update public.ai_reviews set status = 'failed', error = left(reason, 500) where id = review_id;
$$;

revoke execute on function public.claim_ai_reviews(uuid) from public, anon, authenticated;
revoke execute on function public.complete_ai_review(uuid, integer, jsonb) from public, anon, authenticated;
revoke execute on function public.fail_ai_review(uuid, text) from public, anon, authenticated;
grant execute on function public.claim_ai_reviews(uuid) to service_role;
grant execute on function public.complete_ai_review(uuid, integer, jsonb) to service_role;
grant execute on function public.fail_ai_review(uuid, text) to service_role;
