insert into storage.buckets (id, name, public, allowed_mime_types)
values ('listening', 'listening', true, array['audio/mpeg'])
on conflict (id) do update set public = excluded.public, allowed_mime_types = excluded.allowed_mime_types;
