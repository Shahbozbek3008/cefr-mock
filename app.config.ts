import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import type { ConfigContext, ExpoConfig } from 'expo/config';

type Plugin = [string, object] | string;
type Env = Record<string, string | undefined>;

type FirebaseApp = {
  projectId: string;
  projectNumber: string;
  storageBucket: string;
  appId: string;
  apiKey: string;
};

const OUTPUT_DIR = '.firebase';

const env = (key: string) => process.env[key]?.trim() || undefined;

const googleIosClientId = env('EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID');
const googleIosUrlScheme = googleIosClientId?.split('.').reverse().join('.');

const firebaseApp = (platform: 'ANDROID' | 'IOS'): FirebaseApp | null => {
  const keys = {
    projectId: 'FIREBASE_PROJECT_ID',
    projectNumber: 'FIREBASE_PROJECT_NUMBER',
    appId: `FIREBASE_${platform}_APP_ID`,
    apiKey: `FIREBASE_${platform}_API_KEY`,
  };
  const values: Env = Object.fromEntries(Object.entries(keys).map(([field, key]) => [field, env(key)]));
  if (!values.appId && !values.apiKey) return null;

  const missing = Object.entries(keys)
    .filter(([field]) => !values[field])
    .map(([, key]) => key);
  if (missing.length) throw new Error(`Firebase ${platform} config is incomplete. Missing: ${missing.join(', ')}`);

  const app = values as Omit<FirebaseApp, 'storageBucket'>;
  return { ...app, storageBucket: env('FIREBASE_STORAGE_BUCKET') ?? `${app.projectId}.firebasestorage.app` };
};

const writeOutput = (name: string, content: string) => {
  mkdirSync(OUTPUT_DIR, { recursive: true });
  writeFileSync(join(OUTPUT_DIR, name), content);
  return `./${OUTPUT_DIR}/${name}`;
};

const androidServices = (app: FirebaseApp, packageName: string) =>
  JSON.stringify(
    {
      project_info: {
        project_number: app.projectNumber,
        project_id: app.projectId,
        storage_bucket: app.storageBucket,
      },
      client: [
        {
          client_info: {
            mobilesdk_app_id: app.appId,
            android_client_info: { package_name: packageName },
          },
          oauth_client: [],
          api_key: [{ current_key: app.apiKey }],
          services: { appinvite_service: { other_platform_oauth_client: [] } },
        },
      ],
      configuration_version: '1',
    },
    null,
    2,
  );

const plistEntry = ([key, value]: [string, string | boolean]) =>
  typeof value === 'boolean'
    ? `\t<key>${key}</key>\n\t<${value}/>`
    : `\t<key>${key}</key>\n\t<string>${value}</string>`;

const iosServices = (app: FirebaseApp, bundleId: string) => {
  const entries: [string, string | boolean][] = [
    ['API_KEY', app.apiKey],
    ['GCM_SENDER_ID', app.projectNumber],
    ['PLIST_VERSION', '1'],
    ['BUNDLE_ID', bundleId],
    ['PROJECT_ID', app.projectId],
    ['STORAGE_BUCKET', app.storageBucket],
    ['IS_ADS_ENABLED', false],
    ['IS_ANALYTICS_ENABLED', false],
    ['IS_APPINVITE_ENABLED', true],
    ['IS_GCM_ENABLED', true],
    ['IS_SIGNIN_ENABLED', true],
    ['GOOGLE_APP_ID', app.appId],
  ];
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">',
    '<plist version="1.0">',
    '<dict>',
    ...entries.map(plistEntry),
    '</dict>',
    '</plist>',
    '',
  ].join('\n');
};

const existing = (...paths: (string | undefined)[]) => paths.find((path) => path && existsSync(path));

const resolveAndroid = (packageName?: string) => {
  const app = firebaseApp('ANDROID');
  if (app && packageName) return writeOutput('google-services.json', androidServices(app, packageName));
  return existing(env('GOOGLE_SERVICES_JSON'), './google-services.json');
};

const resolveIos = (bundleId?: string) => {
  const app = firebaseApp('IOS');
  if (app && bundleId) return writeOutput('GoogleService-Info.plist', iosServices(app, bundleId));
  return existing(env('GOOGLE_SERVICES_PLIST'), './GoogleService-Info.plist');
};

export default ({ config }: ConfigContext): ExpoConfig => {
  const androidFile = resolveAndroid(config.android?.package);
  const iosFile = resolveIos(config.ios?.bundleIdentifier);
  const firebasePlugins: Plugin[] =
    androidFile || iosFile
      ? [
          '@react-native-firebase/app',
          '@react-native-firebase/messaging',
          ['expo-build-properties', { ios: { useFrameworks: 'static' } }],
        ]
      : [];
  const googlePlugins: Plugin[] = googleIosUrlScheme
    ? [['@react-native-google-signin/google-signin', { iosUrlScheme: googleIosUrlScheme }]]
    : [];

  return {
    ...(config as ExpoConfig),
    ios: {
      ...config.ios,
      googleServicesFile: iosFile,
      entitlements: iosFile
        ? { ...config.ios?.entitlements, 'aps-environment': 'production' }
        : config.ios?.entitlements,
    },
    android: { ...config.android, googleServicesFile: androidFile },
    plugins: [...(config.plugins ?? []), ...googlePlugins, ...firebasePlugins],
  };
};
