import { PermissionsAndroid, Platform } from 'react-native';
import { getApp } from '@react-native-firebase/app';
import { AuthorizationStatus, getMessaging, requestPermission } from '@react-native-firebase/messaging';
import type { Messaging } from '@react-native-firebase/messaging';

const ANDROID_RUNTIME_PERMISSION_API = 33;

let client: Messaging | null | undefined;

export const messaging = () => {
  if (client !== undefined) return client;
  try {
    client = getMessaging(getApp());
  } catch {
    client = null;
  }
  return client;
};

export const requestPushPermission = async (target: Messaging) => {
  if (Platform.OS === 'android') {
    if (Platform.Version < ANDROID_RUNTIME_PERMISSION_API) return true;
    const result = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
    return result === PermissionsAndroid.RESULTS.GRANTED;
  }
  const status = await requestPermission(target);
  return status === AuthorizationStatus.AUTHORIZED || status === AuthorizationStatus.PROVISIONAL;
};
