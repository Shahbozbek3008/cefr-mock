create extension if not exists pg_net with schema extensions;

alter table public.profiles
  add column locale text not null default 'uz' check (locale in ('uz', 'ru', 'en'));

revoke update on public.profiles from authenticated;
grant update (
  first_name, last_name, avatar_path, locale, target_level, exam_date, daily_minutes, reminder_enabled, push_token
) on public.profiles to authenticated;

alter table public.notifications add column pushed_at timestamptz;

create or replace function public.dispatch_push()
returns trigger
language plpgsql
security definer
set search_path = public, extensions
as $$
begin
  perform net.http_post(
    url := 'https://sdbubxmlrmpfsszhzgkw.supabase.co/functions/v1/push-notify',
    body := jsonb_build_object('notificationId', new.id),
    headers := jsonb_build_object('Content-Type', 'application/json')
  );
  return new;
end;
$$;

create trigger notifications_dispatch_push
after insert on public.notifications
for each row execute function public.dispatch_push();
