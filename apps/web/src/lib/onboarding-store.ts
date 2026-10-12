'use client';

import { useEffect, useState } from 'react';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { OnboardingState } from '@/types/auth';
import { ONBOARDING_INITIAL } from '@/constants/auth';

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      ...ONBOARDING_INITIAL,
      setTargetLevel: (targetLevel) => set({ targetLevel }),
      setExamDate: (examDate) => set({ examDate }),
      setDailyMinutes: (dailyMinutes) => set({ dailyMinutes }),
      setAccount: (firstName, phone) => set({ firstName, phone }),
      reset: () => set(ONBOARDING_INITIAL),
    }),
    {
      name: 'onboarding',
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: ({ targetLevel, examDate, dailyMinutes, firstName, phone }) => ({ targetLevel, examDate, dailyMinutes, firstName, phone }),
    },
  ),
);

const persistApi = () => (typeof window === 'undefined' ? null : useOnboardingStore.persist);

export const useOnboardingHydrated = () => {
  const [hydrated, setHydrated] = useState(() => persistApi()?.hasHydrated() ?? false);
  useEffect(() => {
    const api = persistApi();
    if (!api) return;
    const unsubscribe = api.onFinishHydration(() => setHydrated(true));
    api.rehydrate();
    return unsubscribe;
  }, []);
  return hydrated;
};
