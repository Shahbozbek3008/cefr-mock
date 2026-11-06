alter table public.profiles add column is_admin boolean not null default false;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce((select p.is_admin from public.profiles p where p.id = (select auth.uid())), false);
$$;

revoke execute on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

alter table public.tests alter column published_at drop not null;

create index if not exists attempts_user_test on public.attempts (user_id, test_id);

create or replace function public.has_attempt_on(target_test text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.attempts a where a.test_id = target_test and a.user_id = (select auth.uid())
  );
$$;

revoke execute on function public.has_attempt_on(text) from public, anon;
grant execute on function public.has_attempt_on(text) to authenticated;

drop policy "Tests are readable by signed in users" on public.tests;
create policy "Tests are readable by signed in users" on public.tests
for select to authenticated using (
  published_at is not null
  or (select public.is_admin())
  or public.has_attempt_on(id)
);

create policy "Keys are readable by admins" on public.test_keys
for select to authenticated using ((select public.is_admin()));

create or replace function public.admin_save_test(
  test_id text,
  meta jsonb,
  content jsonb,
  keys jsonb,
  scripts jsonb
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'forbidden' using errcode = '42501';
  end if;
  if test_id !~ '^[a-z0-9-]{1,40}$' then
    raise exception 'invalid_test_id' using errcode = '22023';
  end if;
  if jsonb_typeof(content -> 'listening') <> 'array' or jsonb_typeof(content -> 'reading') <> 'array'
    or jsonb_typeof(content -> 'writing') <> 'array' or jsonb_typeof(content -> 'speaking') <> 'array'
    or jsonb_typeof(content -> 'sections') <> 'array' then
    raise exception 'invalid_content' using errcode = '22023';
  end if;
  if jsonb_typeof(keys) <> 'object' or jsonb_typeof(scripts) <> 'array' then
    raise exception 'invalid_keys' using errcode = '22023';
  end if;

  insert into public.tests (id, number, title, format_month, format_year, duration_label, is_new, is_free, is_pro, content, published_at)
  values (
    test_id,
    (meta ->> 'number')::integer,
    meta ->> 'title',
    (meta ->> 'formatMonth')::smallint,
    (meta ->> 'formatYear')::smallint,
    coalesce(meta ->> 'durationLabel', '2:45'),
    coalesce((meta ->> 'isNew')::boolean, false),
    not coalesce((meta ->> 'isPro')::boolean, false),
    coalesce((meta ->> 'isPro')::boolean, false),
    content,
    null
  )
  on conflict (id) do update set
    number = excluded.number,
    title = excluded.title,
    format_month = excluded.format_month,
    format_year = excluded.format_year,
    duration_label = excluded.duration_label,
    is_new = excluded.is_new,
    is_free = excluded.is_free,
    is_pro = excluded.is_pro,
    content = excluded.content;

  insert into public.test_keys (test_id, keys, scripts)
  values (admin_save_test.test_id, keys, scripts)
  on conflict on constraint test_keys_pkey do update set keys = excluded.keys, scripts = excluded.scripts;
end;
$$;

create or replace function public.admin_set_published(test_id text, published boolean)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'forbidden' using errcode = '42501';
  end if;

  update public.tests t
  set published_at = case when published then coalesce(t.published_at, now()) else null end
  where t.id = admin_set_published.test_id;

  if not found then
    raise exception 'test_not_found' using errcode = 'P0002';
  end if;
end;
$$;

create or replace function public.admin_delete_test(test_id text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'forbidden' using errcode = '42501';
  end if;
  if exists (select 1 from public.attempts a where a.test_id = admin_delete_test.test_id) then
    raise exception 'test_has_attempts' using errcode = '23503';
  end if;

  delete from public.tests t where t.id = admin_delete_test.test_id;
end;
$$;

revoke execute on function public.admin_save_test(text, jsonb, jsonb, jsonb, jsonb) from public, anon;
revoke execute on function public.admin_set_published(text, boolean) from public, anon;
revoke execute on function public.admin_delete_test(text) from public, anon;
grant execute on function public.admin_save_test(text, jsonb, jsonb, jsonb, jsonb) to authenticated;
grant execute on function public.admin_set_published(text, boolean) to authenticated;
grant execute on function public.admin_delete_test(text) to authenticated;

create policy "Listening audio is managed by admins (insert)" on storage.objects
for insert to authenticated with check (bucket_id = 'listening' and (select public.is_admin()));

create policy "Listening audio is managed by admins (update)" on storage.objects
for update to authenticated using (bucket_id = 'listening' and (select public.is_admin()));

create policy "Listening audio is managed by admins (delete)" on storage.objects
for delete to authenticated using (bucket_id = 'listening' and (select public.is_admin()));

create policy "Listening audio is listed by admins" on storage.objects
for select to authenticated using (bucket_id = 'listening' and (select public.is_admin()));
