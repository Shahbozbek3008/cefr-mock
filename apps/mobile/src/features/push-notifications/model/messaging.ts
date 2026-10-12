import { NativeModules, PermissionsAndroid, Platform, TurboModuleRegistry } from 'react-native';
import type { Messaging } from '@react-native-firebase/messaging';

type MessagingApi = typeof import('@react-native-firebase/messaging');
type AppApi = typeof import('@react-native-firebase/app');

export type Fcm = { api: MessagingApi; client: Messaging };

const NATIVE_MODULE = 'RNFBAppModule';
const ANDROID_RUNTIME_PERMISSION_API = 33;

let cached: Fcm | null | undefined;

const hasNativeModule = () => Boolean(TurboModuleRegistry.get(NATIVE_MODULE) ?? NativeModules[NATIVE_MODULE]);

export const loadFcm = (): Fcm | null => {
  if (cached !== undefined) return cached;
  try {
    if (!hasNativeModule()) {
      cached = null;
      return cached;
    }
    const app = require('@react-native-firebase/app') as AppApi;
    const api = require('@react-native-firebase/messaging') as MessagingApi;
    cached = { api, client: api.getMessaging(app.getApp()) };
  } catch {
    cached = null;
  }
  return cached;
};

export const requestPushPermission = async ({ api, client }: Fcm) => {
  if (Platform.OS === 'android') {
    if (Platform.Version < ANDROID_RUNTIME_PERMISSION_API) return true;
    const result = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
    return result === PermissionsAndroid.RESULTS.GRANTED;
  }
  const status = await api.requestPermission(client);
  return status === api.AuthorizationStatus.AUTHORIZED || status === api.AuthorizationStatus.PROVISIONAL;
};
