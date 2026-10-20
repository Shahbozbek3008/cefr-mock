import { useCallback, useEffect, useState } from 'react';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { deleteToken, getMessaging, getToken, isSupported, onMessage, type MessagePayload } from 'firebase/messaging';
import { registerPushToken, unregisterPushToken, type CefrClient } from '@cefr/core';
import { firebaseConfig } from '@/shared/api/web-push/firebase';
import { FIREBASE_VAPID_KEY } from '@/shared/config/env';
import { PUSH_TOKEN_KEY, PUSH_WORKER_SCOPE, PUSH_WORKER_URL } from './constants';
import type { WebPushStatus } from './types';

const readToken = () => {
  try {
    return localStorage.getItem(PUSH_TOKEN_KEY);
  } catch {
    return null;
  }
};

const writeToken = (token: string | null) => {
  try {
    if (token) localStorage.setItem(PUSH_TOKEN_KEY, token);
    else localStorage.removeItem(PUSH_TOKEN_KEY);
  } catch {
    return;
  }
};

const messaging = () => {
  if (!firebaseConfig) throw new Error('push_unavailable');
  return getMessaging(getApps().length ? getApp() : initializeApp(firebaseConfig));
};

const workerRegistration = () => navigator.serviceWorker.register(PUSH_WORKER_URL, { scope: PUSH_WORKER_SCOPE });

export const webPushAvailable = async () =>
  Boolean(firebaseConfig) && typeof window !== 'undefined' && 'Notification' in window && 'serviceWorker' in navigator && (await isSupported().catch(() => false));

const issueToken = async (client: CefrClient) => {
  const token = await getToken(messaging(), { vapidKey: FIREBASE_VAPID_KEY || undefined, serviceWorkerRegistration: await workerRegistration() });
  const previous = readToken();
  await registerPushToken(client, token, 'web');
  if (previous && previous !== token) await unregisterPushToken(client, previous).catch(() => undefined);
  writeToken(token);
  return token;
};

export const enableWebPush = async (client: CefrClient) => {
  if (!(await webPushAvailable())) throw new Error('push_unavailable');
  const permission = await Notification.requestPermission();
  if (permission !== 'granted') throw new Error('push_denied');
  return issueToken(client);
};

export const disableWebPush = async (client: CefrClient) => {
  const token = readToken();
  writeToken(null);
  if (!token) return;
  await Promise.allSettled([unregisterPushToken(client, token), firebaseConfig ? deleteToken(messaging()) : Promise.resolve()]);
};

export const refreshWebPush = async (client: CefrClient) => {
  if (!readToken() || !(await webPushAvailable()) || Notification.permission !== 'granted') return;
  await issueToken(client);
};

export const onForegroundPush = (handler: (payload: MessagePayload) => void) => onMessage(messaging(), handler);

export const showForegroundPush = async (payload: MessagePayload) => {
  const data = payload.data ?? {};
  if (!data.title) return;
  const registration = await navigator.serviceWorker.getRegistration(PUSH_WORKER_SCOPE);
  await registration?.showNotification(data.title, { body: data.body, icon: '/push-icon.png', badge: '/push-badge.png', data: { url: data.url ?? '/' } });
};

const statusNow = async (): Promise<WebPushStatus> => {
  if (!(await webPushAvailable())) return 'unavailable';
  if (Notification.permission === 'denied') return 'denied';
  return Notification.permission === 'granted' && readToken() ? 'on' : 'off';
};

export const useWebPush = (client: CefrClient) => {
  const [status, setStatus] = useState<WebPushStatus>('checking');

  useEffect(() => {
    let active = true;
    statusNow().then((next) => active && setStatus(next));
    return () => {
      active = false;
    };
  }, []);

  const enable = useCallback(async () => {
    try {
      await enableWebPush(client);
      setStatus('on');
      return true;
    } catch {
      setStatus(await statusNow());
      return false;
    }
  }, [client]);

  const disable = useCallback(async () => {
    await disableWebPush(client);
    setStatus(await statusNow());
    return true;
  }, [client]);

  return { status, enable, disable };
};
