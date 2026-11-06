import { AppError, toAppError } from '@/shared/api/app-error';
import { supabase } from '@/shared/api/supabase';
import { LISTENING_BUCKET } from '@/shared/config/storage';

const MP3_TYPE = 'audio/mpeg';

export const uploadListeningAudio = async (testId: string, partId: string, file: Blob) => {
  const path = `${testId}/${partId}-${Date.now()}.mp3`;
  const { error } = await supabase.storage.from(LISTENING_BUCKET).upload(path, file, { contentType: MP3_TYPE, upsert: true });
  if (error) throw toAppError(error);
  return path;
};

export const listeningAudioUrl = (path: string) => supabase.storage.from(LISTENING_BUCKET).getPublicUrl(path).data.publicUrl;

export const synthesizeLine = async (voice: string, text: string): Promise<ArrayBuffer> => {
  const { data, error } = await supabase.functions.invoke<Blob>('admin-tts', { body: { voice, text } });
  if (error || !data) throw new AppError('ttsFailed');
  return data.arrayBuffer();
};

export const isMp3 = (file: File) => !file.type || file.type === MP3_TYPE;
