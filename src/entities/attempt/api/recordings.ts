import { ensureOk, requireUserId, supabase, unwrap } from '@/shared/api';

const BUCKET = 'recordings';
const SIGNED_URL_TTL_SEC = 60 * 60;
const CONTENT_TYPE = 'audio/mp4';

export const uploadRecording = async (attemptId: string, questionId: string, uri: string) => {
  const path = `${await requireUserId()}/${attemptId}/${questionId}.m4a`;
  const body = await (await fetch(uri)).arrayBuffer();
  ensureOk(await supabase.storage.from(BUCKET).upload(path, body, { contentType: CONTENT_TYPE, upsert: true }));
  return path;
};

export const recordingUrl = async (path: string) =>
  unwrap(await supabase.storage.from(BUCKET).createSignedUrl(path, SIGNED_URL_TTL_SEC)).signedUrl;
