import { existsSync } from 'node:fs';
import type { ConfigContext, ExpoConfig } from 'expo/config';

const iosClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID;
const iosUrlScheme = iosClientId?.split('.').reverse().join('.');

const fileFrom = (env: string | undefined, fallback: string) => {
  const path = env ?? fallback;
  return existsSync(path) ? path : undefined;
};

const androidServices = fileFrom(process.env.GOOGLE_SERVICES_JSON, './google-services.json');
const iosServices = fileFrom(process.env.GOOGLE_SERVICES_PLIST, './GoogleService-Info.plist');
const firebaseEnabled = Boolean(androidServices || iosServices);

type Plugin = [string, object] | string;

const firebasePlugins: Plugin[] = firebaseEnabled
  ? [
      '@react-native-firebase/app',
      '@react-native-firebase/messaging',
      ['expo-build-properties', { ios: { useFrameworks: 'static' } }],
    ]
  : [];

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...(config as ExpoConfig),
  ios: { ...config.ios, googleServicesFile: iosServices },
  android: { ...config.android, googleServicesFile: androidServices },
  plugins: [
    ...(config.plugins ?? []),
    ...(iosUrlScheme ? [['@react-native-google-signin/google-signin', { iosUrlScheme }] as Plugin] : []),
    ...firebasePlugins,
  ],
});
