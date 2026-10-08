import { useEffect } from 'react';
import { registerPushToken, unregisterPushToken } from '@cefr/core';
import { updateProfile, useUserStore } from '@/entities/user/model';
import { supabase } from '@/shared/api';
import { translate, useI18n, useLocaleStore } from '@/shared/i18n';
import { useToast } from '@/shared/ui';
import { loadFcm, requestPushPermission } from './messaging';
import { openMessage, routeOf } from './route';
import { usePushStore } from './store';

const saveToken = (token: string | null) => {
  const previous = usePushStore.getState().token;
  usePushStore.getState().setToken(token);
  updateProfile({ pushToken: token }).catch(() => undefined);
  if (token) registerPushToken(supabase, token, 'mobile').catch(() => undefined);
  if (previous && previous !== token) unregisterPushToken(supabase, previous).catch(() => undefined);
};

const useTokenSync = () => {
  const enabled = useUserStore((s) => s.reminderEnabled);
  const setEnabled = useUserStore((s) => s.setReminderEnabled);
  const showToast = useToast((s) => s.show);

  useEffect(() => {
    const fcm = loadFcm();
    if (!fcm) return;
    const { api, client } = fcm;

    if (!enabled) {
      if (usePushStore.getState().token) {
        api.deleteToken(client).catch(() => undefined);
        saveToken(null);
      }
      return;
    }

    let active = true;
    requestPushPermission(fcm)
      .then(async (allowed) => {
        if (!active) return;
        if (!allowed) {
          setEnabled(false);
          const message = translate(useLocaleStore.getState().locale, 'notifications.denied');
          showToast({ message, tone: 'error' });
          return;
        }
        saveToken(await api.getToken(client));
      })
      .catch(() => undefined);

    const unsubscribe = api.onTokenRefresh(client, saveToken);
    return () => {
      active = false;
      unsubscribe();
    };
  }, [enabled, setEnabled, showToast]);
};

const useOpenedNotifications = () => {
  useEffect(() => {
    const fcm = loadFcm();
    if (!fcm) return;
    fcm.api
      .getInitialNotification(fcm.client)
      .then(openMessage)
      .catch(() => undefined);
    return fcm.api.onNotificationOpenedApp(fcm.client, openMessage);
  }, []);
};

const useForegroundMessages = () => {
  const showToast = useToast((s) => s.show);
  const { t } = useI18n();

  useEffect(() => {
    const fcm = loadFcm();
    if (!fcm) return;
    return fcm.api.onMessage(fcm.client, (message) => {
      const text = message.notification?.body ?? message.notification?.title;
      if (!text) return;
      const href = routeOf(message);
      showToast({
        message: text,
        actionLabel: href ? t('notifications.open') : undefined,
        onAction: href ? () => openMessage(message) : undefined,
      });
    });
  }, [showToast, t]);
};

export const usePushNotifications = () => {
  useTokenSync();
  useOpenedNotifications();
  useForegroundMessages();
};
