alter table public.test_keys
  add column scripts jsonb not null default '[]';
