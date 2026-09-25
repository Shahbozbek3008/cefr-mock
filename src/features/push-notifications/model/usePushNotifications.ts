import { useEffect } from 'react';
import {
  deleteToken,
  getInitialNotification,
  getToken,
  onMessage,
  onNotificationOpenedApp,
  onTokenRefresh,
} from '@react-native-firebase/messaging';
import { useUserStore } from '@/entities/user/model';
import { translate, useI18n, useLocaleStore } from '@/shared/i18n';
import { useToast } from '@/shared/ui';
import { messaging, requestPushPermission } from './messaging';
import { openMessage, routeOf } from './route';
import { usePushStore } from './store';

const useTokenSync = () => {
  const enabled = useUserStore((s) => s.reminderEnabled);
  const setEnabled = useUserStore((s) => s.setReminderEnabled);
  const setToken = usePushStore((s) => s.setToken);
  const showToast = useToast((s) => s.show);

  useEffect(() => {
    const client = messaging();
    if (!client) return;

    if (!enabled) {
      if (usePushStore.getState().token) {
        deleteToken(client).catch(() => undefined);
        setToken(null);
      }
      return;
    }

    let active = true;
    requestPushPermission(client)
      .then(async (allowed) => {
        if (!active) return;
        if (!allowed) {
          setEnabled(false);
          const message = translate(useLocaleStore.getState().locale, 'notifications.denied');
          showToast({ message, tone: 'error' });
          return;
        }
        setToken(await getToken(client));
      })
      .catch(() => undefined);

    const unsubscribe = onTokenRefresh(client, setToken);
    return () => {
      active = false;
      unsubscribe();
    };
  }, [enabled, setEnabled, setToken, showToast]);
};

const useOpenedNotifications = () => {
  useEffect(() => {
    const client = messaging();
    if (!client) return;
    getInitialNotification(client)
      .then(openMessage)
      .catch(() => undefined);
    return onNotificationOpenedApp(client, openMessage);
  }, []);
};

const useForegroundMessages = () => {
  const showToast = useToast((s) => s.show);
  const { t } = useI18n();

  useEffect(() => {
    const client = messaging();
    if (!client) return;
    return onMessage(client, (message) => {
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
