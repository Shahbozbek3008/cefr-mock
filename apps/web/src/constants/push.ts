import { FIREBASE_SDK_VERSION } from '@/lib/firebase/config';

export const FIREBASE_CDN = `https://www.gstatic.com/firebasejs/${FIREBASE_SDK_VERSION}`;

export const PUSH_WORKER_URL = '/firebase-messaging-sw.js';

export const PUSH_WORKER_SCOPE = '/firebase-cloud-messaging-push-scope';

export const PUSH_TOKEN_KEY = 'web-push-token';
