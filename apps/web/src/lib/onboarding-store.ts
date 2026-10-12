'use client';

import { useEffect, useState } from 'react';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { DEFAULT_DAILY_MINUTES, type DailyMinutes, type OnboardingDraft, type TargetLevel } from '@cefr/core';

type OnboardingState = Omit<Required<OnboardingDraft>, 'dailyMinutes'> & {
  dailyMinutes: DailyMinutes;
  phone: string;
  setTargetLevel: (targetLevel: TargetLevel) => void;
  setExamDate: (examDate: string | null) => void;
  setDailyMinutes: (dailyMinutes: DailyMinutes) => void;
  setAccount: (firstName: string, phone: string) => void;
  reset: () => void;
};

const INITIAL = {
  targetLevel: null,
  examDate: null,
  dailyMinutes: DEFAULT_DAILY_MINUTES as DailyMinutes,
  firstName: '',
  phone: '',
};

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      ...INITIAL,
      setTargetLevel: (targetLevel) => set({ targetLevel }),
      setExamDate: (examDate) => set({ examDate }),
      setDailyMinutes: (dailyMinutes) => set({ dailyMinutes }),
      setAccount: (firstName, phone) => set({ firstName, phone }),
      reset: () => set(INITIAL),
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
