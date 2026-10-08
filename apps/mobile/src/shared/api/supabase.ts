import 'react-native-url-polyfill/auto';
import { AppState } from 'react-native';
import { createClient } from '@supabase/supabase-js';
import { storage } from '../lib/storage';
import type { Database } from './database';

const url = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
const key = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';
const PLACEHOLDER_URL = 'https://not-configured.supabase.co';

export const isSupabaseConfigured = url.startsWith('https://') && key.length > 0;

const authStorage = {
  getItem: (name: string) => storage.getString(name) ?? null,
  setItem: (name: string, value: string) => storage.set(name, value),
  removeItem: (name: string) => {
    storage.remove(name);
  },
};

export const supabase = createClient<Database>(isSupabaseConfigured ? url : PLACEHOLDER_URL, key || 'anon', {
  auth: {
    storage: authStorage,
    autoRefreshToken: isSupabaseConfigured,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

AppState.addEventListener('change', (state) => {
  if (!isSupabaseConfigured) return;
  if (state === 'active') supabase.auth.startAutoRefresh();
  else supabase.auth.stopAutoRefresh();
});
