import { createUploadQueue } from '@cefr/core';
import { useAttemptStore } from '@/entities/attempt';
import { supabase } from '@/shared/api';

export const uploads = createUploadQueue(useAttemptStore, async (uri) => (await fetch(uri)).arrayBuffer());

export const uploadAnswer = (questionId: string, uri: string) => uploads.upload(supabase, questionId, uri);

export const flushUploads = () => uploads.flush(supabase);
