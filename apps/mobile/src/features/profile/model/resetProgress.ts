import { useAttemptStore } from '@/entities/attempt';
import { resetProgress as resetRemote } from '@cefr/core';
import { supabase } from '@/shared/api';
import { queryClient } from '@/shared/lib';

export const resetProgress = async () => {
  await resetRemote(supabase);
  useAttemptStore.getState().reset();
  await queryClient.resetQueries();
};
