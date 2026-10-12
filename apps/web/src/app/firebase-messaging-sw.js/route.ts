import { firebaseConfig } from '@/lib/firebase/config';
import { FIREBASE_CDN } from '@/constants/push';

const worker = (config: string) => `
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

export function GET() {
  const body = firebaseConfig ? worker(JSON.stringify(firebaseConfig)) : 'self.registration.unregister();';
  return new Response(body, {
    headers: {
      'Content-Type': 'application/javascript; charset=utf-8',
      'Cache-Control': 'no-cache',
      'Service-Worker-Allowed': '/',
    },
  });
}
