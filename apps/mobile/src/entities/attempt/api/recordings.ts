import { recordingUrl as coreRecordingUrl, uploadRecording as coreUploadRecording } from '@cefr/core';
import { supabase } from '@/shared/api';

export const uploadRecording = async (attemptId: string, questionId: string, uri: string) => {
  const body = await (await fetch(uri)).arrayBuffer();
  return coreUploadRecording(supabase, attemptId, questionId, body);
};

export const recordingUrl = (path: string) => coreRecordingUrl(supabase, path);
