export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL ?? '';

export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY ?? '';

export const LANDING_URL = import.meta.env.VITE_LANDING_URL ?? 'http://localhost:3001';

export const FIREBASE_OPTIONS = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const FIREBASE_VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY ?? '';
