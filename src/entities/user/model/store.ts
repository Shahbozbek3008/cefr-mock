import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { mmkvStorage } from '@/shared/lib';
import type { DailyMinutes, OnboardingState, TargetLevel, User } from './types';

type UserStore = OnboardingState & {
  user: User | null;
  onboardingCompleted: boolean;
  setTargetLevel: (level: TargetLevel) => void;
  setExamDate: (date: string | null) => void;
  setDailyMinutes: (minutes: DailyMinutes) => void;
  setReminderEnabled: (enabled: boolean) => void;
  completeOnboarding: () => void;
  setUser: (user: User) => void;
  signOut: () => void;
};

const initial: OnboardingState & { user: User | null; onboardingCompleted: boolean } = {
  targetLevel: null,
  examDate: null,
  dailyMinutes: null,
  reminderEnabled: true,
  user: null,
  onboardingCompleted: false,
};

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      ...initial,
      setTargetLevel: (targetLevel) => set({ targetLevel }),
      setExamDate: (examDate) => set({ examDate }),
      setDailyMinutes: (dailyMinutes) => set({ dailyMinutes }),
      setReminderEnabled: (reminderEnabled) => set({ reminderEnabled }),
      completeOnboarding: () => set({ onboardingCompleted: true }),
      setUser: (user) => set({ user }),
      signOut: () => set({ user: null }),
    }),
    {
      name: 'user-store',
      storage: createJSONStorage(() => mmkvStorage),
    },
  ),
);

export const selectIsAuthenticated = (state: UserStore) => state.user !== null;
export const selectOnboardingCompleted = (state: UserStore) => state.onboardingCompleted;
