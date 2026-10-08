import { router } from 'expo-router';
import type { Href } from 'expo-router';
import type { RemoteMessage } from '@react-native-firebase/messaging';

export const routeOf = (message: RemoteMessage | null) => {
  const url = message?.data?.url;
  return typeof url === 'string' && url.startsWith('/') ? (url as Href) : null;
};

export const openMessage = (message: RemoteMessage | null) => {
  const href = routeOf(message);
  if (href) router.push(href);
};
