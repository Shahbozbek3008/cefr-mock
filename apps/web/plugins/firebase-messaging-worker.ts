import type { Plugin } from 'vite';
import { FIREBASE_CDN, PUSH_WORKER_URL } from '../src/shared/api/web-push/constants';

type Env = Record<string, string | undefined>;

const CONFIG_KEYS = {
  apiKey: 'VITE_FIREBASE_API_KEY',
  projectId: 'VITE_FIREBASE_PROJECT_ID',
  messagingSenderId: 'VITE_FIREBASE_MESSAGING_SENDER_ID',
  appId: 'VITE_FIREBASE_APP_ID',
} as const;

const WORKER_HEADERS = {
  'Content-Type': 'application/javascript; charset=utf-8',
  'Cache-Control': 'no-cache',
  'Service-Worker-Allowed': '/',
};

const firebaseConfig = (env: Env) => {
  const entries = Object.entries(CONFIG_KEYS).map(([key, name]) => [key, env[name]] as const);
  return entries.every(([, value]) => Boolean(value)) ? Object.fromEntries(entries) : null;
};

const workerSource = (config: string) => `
importScripts('${FIREBASE_CDN}/firebase-app-compat.js', '${FIREBASE_CDN}/firebase-messaging-compat.js');

firebase.initializeApp(${config});

firebase.messaging().onBackgroundMessage((payload) => {
  const data = payload.data || {};
  if (!data.title) return;
  return self.registration.showNotification(data.title, {
    body: data.body,
    icon: '/push-icon.png',
    badge: '/push-badge.png',
    data: { url: data.url || '/' },
  });
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const target = new URL((event.notification.data && event.notification.data.url) || '/', self.location.origin).href;
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windows) => {
      const open = windows.find((client) => client.url.startsWith(self.location.origin));
      if (!open) return self.clients.openWindow(target);
      return open.focus().then(() => open.navigate(target));
    }),
  );
});
`;

export function firebaseMessagingWorker(env: Env): Plugin {
  const config = firebaseConfig(env);
  const source = config ? workerSource(JSON.stringify(config)) : 'self.registration.unregister();';

  return {
    name: 'cefr:firebase-messaging-worker',
    configureServer(server) {
      server.middlewares.use(PUSH_WORKER_URL, (_request, response) => {
        Object.entries(WORKER_HEADERS).forEach(([name, value]) => response.setHeader(name, value));
        response.end(source);
      });
    },
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: PUSH_WORKER_URL.slice(1), source });
    },
  };
}
