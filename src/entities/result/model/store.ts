import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { mmkvStorage } from '@/shared/lib';
import type { TestResult } from './types';

type ResultStore = {
  results: TestResult[];
  add: (result: TestResult) => void;
};

export const useResultStore = create<ResultStore>()(
  persist(
    (set) => ({
      results: [],
      add: (result) => set((state) => ({ results: [result, ...state.results.filter((r) => r.id !== result.id)] })),
    }),
    {
      name: 'result-store',
      storage: createJSONStorage(() => mmkvStorage),
    },
  ),
);
