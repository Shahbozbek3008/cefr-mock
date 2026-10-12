create table public.push_tokens (
  token text primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  platform text not null check (platform in ('mobile', 'web')),
  updated_at timestamptz not null default now()
);

create index push_tokens_user on public.push_tokens (user_id);

alter table public.push_tokens enable row level security;

create policy "push_tokens_select_own" on public.push_tokens
  for select to authenticated
  using (user_id = auth.uid());

revoke all on public.push_tokens from anon, authenticated;
grant select on public.push_tokens to authenticated;

create or replace function public.register_push_token(push_token text, push_platform text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'not_authenticated';
  end if;

  insert into public.push_tokens (token, user_id, platform, updated_at)
  values (push_token, auth.uid(), push_platform, now())
  on conflict (token) do update
    set user_id = excluded.user_id,
        platform = excluded.platform,
        updated_at = now();
end;
$$;

create or replace function public.unregister_push_token(push_token text)
returns void
language sql
security definer
set search_path = public
as $$
  delete from public.push_tokens where token = push_token and user_id = auth.uid();
$$;

revoke execute on function public.register_push_token(text, text) from public, anon;
revoke execute on function public.unregister_push_token(text) from public, anon;
grant execute on function public.register_push_token(text, text) to authenticated;
grant execute on function public.unregister_push_token(text) to authenticated;

insert into public.push_tokens (token, user_id, platform)
select push_token, id, 'mobile'
from public.profiles
where push_token is not null
on conflict (token) do nothing;
