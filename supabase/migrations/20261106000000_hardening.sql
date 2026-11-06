create or replace function public.guard_attempt_deadlines()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  max_deadline_ms numeric := (extract(epoch from now()) + 65 * 60) * 1000;
  incoming jsonb := '{}';
  entry record;
begin
  if new.ends_at is not distinct from old.ends_at then
    return new;
  end if;

  if jsonb_typeof(new.ends_at) = 'object' then
    for entry in select key, value from jsonb_each(new.ends_at) loop
      if jsonb_typeof(entry.value) = 'number' then
        incoming := incoming || jsonb_build_object(entry.key, least((entry.value #>> '{}')::numeric, max_deadline_ms));
      end if;
    end loop;
  end if;

  new.ends_at := incoming || coalesce(old.ends_at, '{}');
  return new;
end;
$$;

drop trigger if exists attempts_guard_deadlines on public.attempts;
create trigger attempts_guard_deadlines
before update of ends_at on public.attempts
for each row execute function public.guard_attempt_deadlines();

create or replace function public.dispatch_push()
returns trigger
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  base_url text;
  webhook_secret text;
begin
  begin
    select decrypted_secret into base_url from vault.decrypted_secrets where name = 'project_url';
    select decrypted_secret into webhook_secret from vault.decrypted_secrets where name = 'push_webhook_secret';
  exception when others then
    base_url := null;
    webhook_secret := null;
  end;

  perform net.http_post(
    url := coalesce(base_url, 'https://sdbubxmlrmpfsszhzgkw.supabase.co') || '/functions/v1/push-notify',
    body := jsonb_build_object('notificationId', new.id),
    headers := jsonb_build_object('Content-Type', 'application/json')
      || case when webhook_secret is null then '{}'::jsonb else jsonb_build_object('x-webhook-secret', webhook_secret) end
  );
  return new;
end;
$$;
