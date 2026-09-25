import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { mmkvStorage } from '@/shared/lib';

type PushStore = {
  token: string | null;
  setToken: (token: string | null) => void;
};

export const usePushStore = create<PushStore>()(
  persist(
    (set) => ({
      token: null,
      setToken: (token) => set({ token }),
    }),
    { name: 'push', storage: createJSONStorage(() => mmkvStorage) },
  ),
);
