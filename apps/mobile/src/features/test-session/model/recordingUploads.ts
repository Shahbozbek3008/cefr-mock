import { uploadRecording, useAttemptStore } from '@/entities/attempt';

const pending = new Map<string, Promise<void>>();

export const uploadAnswer = (questionId: string, uri: string) => {
  const { attemptId } = useAttemptStore.getState();
  if (!attemptId) return;

  const task = uploadRecording(attemptId, questionId, uri)
    .then((path) => {
      const state = useAttemptStore.getState();
      if (state.attemptId === attemptId && state.recordings[questionId] === uri) state.setUpload(questionId, path);
    })
    .finally(() => {
      if (pending.get(questionId) === task) pending.delete(questionId);
    });

  pending.set(questionId, task);
  task.catch(() => undefined);
};

export const flushUploads = async () => {
  await Promise.allSettled(pending.values());
  const { recordings, uploads } = useAttemptStore.getState();
  Object.entries(recordings)
    .filter(([questionId, uri]) => uri && !uploads[questionId])
    .forEach(([questionId, uri]) => uploadAnswer(questionId, uri));
  await Promise.all(pending.values());
};
