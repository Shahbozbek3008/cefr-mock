'use client';

import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useCefrClient } from '@cefr/core';
import { useRouter } from '@/i18n/navigation';
import { ROUTES } from '@/lib/constants';
import { useAttemptStore } from '@/lib/attempt-store';

export const useSignOut = () => {
  const client = useCefrClient();
  const queryClient = useQueryClient();
  const router = useRouter();

  return useCallback(
    async (scope: 'local' | 'global' = 'local') => {
      await client.auth.signOut({ scope }).catch(() => undefined);
      useAttemptStore.getState().reset();
      queryClient.clear();
      router.replace(ROUTES.login);
      router.refresh();
    },
    [client, queryClient, router],
  );
};
