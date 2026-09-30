import { useAttemptStore } from '@/entities/attempt';
import { supabase, unwrap } from '@/shared/api';
import { queryClient } from '@/shared/lib';

const RECORDINGS_BUCKET = 'recordings';

export const resetProgress = async () => {
  const recordings = unwrap(await supabase.rpc('reset_progress'));
  if (recordings.length) await supabase.storage.from(RECORDINGS_BUCKET).remove(recordings).catch(() => undefined);
  useAttemptStore.getState().reset();
  await queryClient.resetQueries();
};
