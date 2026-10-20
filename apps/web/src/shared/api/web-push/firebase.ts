import type { FirebaseOptions } from 'firebase/app';
import { FIREBASE_OPTIONS } from '@/shared/config/env';

export const firebaseConfig: FirebaseOptions | null = Object.values(FIREBASE_OPTIONS).every(Boolean) ? FIREBASE_OPTIONS : null;
