'use client';

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { notificationKeys, resultKeys, useCefrClient } from '@cefr/core';
import { onForegroundPush, refreshWebPush, showForegroundPush, webPushAvailable } from '@/lib/firebase/web-push';

export function WebPushSync() {
  const client = useCefrClient();
  const queryClient = useQueryClient();

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    let active = true;

    refreshWebPush(client).catch(() => undefined);
    webPushAvailable().then((available) => {
      if (!available || !active) return;
      unsubscribe = onForegroundPush((payload) => {
        showForegroundPush(payload).catch(() => undefined);
        queryClient.invalidateQueries({ queryKey: resultKeys.all });
        queryClient.invalidateQueries({ queryKey: notificationKeys.all });
      });
    });

    return () => {
      active = false;
      unsubscribe?.();
    };
  }, [client, queryClient]);

  return null;
}
