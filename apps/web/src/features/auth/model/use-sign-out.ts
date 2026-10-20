import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useCefrClient } from '@cefr/core';
import { useRouter } from '@/shared/i18n/navigation';
import { ROUTES } from '@/shared/config/routes';
import { useAttemptStore } from '@/entities/attempt';
import { disableWebPush } from '@/shared/api/web-push/web-push';

export const useSignOut = () => {
  const client = useCefrClient();
  const queryClient = useQueryClient();
  const router = useRouter();

  return useCallback(
    async (scope: 'local' | 'global' = 'local') => {
      await disableWebPush(client).catch(() => undefined);
      await client.auth.signOut({ scope }).catch(() => undefined);
      useAttemptStore.getState().reset();
      queryClient.clear();
      router.replace(ROUTES.login);
    },
    [client, queryClient, router],
  );
};
