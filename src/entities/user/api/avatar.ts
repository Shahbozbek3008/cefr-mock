import { ensureOk, requireUserId, supabase } from '@/shared/api';

const BUCKET = 'avatars';
const CONTENT_TYPE = 'image/jpeg';

export const avatarUrl = (path: string) => supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;

export const uploadAvatar = async (uri: string) => {
  const path = `${await requireUserId()}/${Date.now()}.jpg`;
  const body = await (await fetch(uri)).arrayBuffer();
  ensureOk(await supabase.storage.from(BUCKET).upload(path, body, { contentType: CONTENT_TYPE }));
  return path;
};

export const removeAvatar = async (path: string) => {
  ensureOk(await supabase.storage.from(BUCKET).remove([path]));
};
