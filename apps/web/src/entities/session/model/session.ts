import { useSyncExternalStore } from 'react';
import { getSupabase } from '@/shared/api/supabase-client';
import type { SessionStatus } from './types';

const listeners = new Set<() => void>();
let status: SessionStatus = 'loading';
let watching = false;

const update = (next: SessionStatus) => {
  if (next === status) return;
  status = next;
  listeners.forEach((listener) => listener());
};

const watchSession = () => {
  if (watching) return;
  watching = true;
  getSupabase().auth.onAuthStateChange((_event, session) => update(session ? 'authenticated' : 'anonymous'));
};

const subscribe = (listener: () => void) => {
  watchSession();
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

export function useSessionStatus() {
  return useSyncExternalStore(subscribe, () => status);
}
