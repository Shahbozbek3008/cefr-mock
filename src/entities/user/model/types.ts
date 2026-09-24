export type TargetLevel = 'B1' | 'B2' | 'C1';

export type DailyMinutes = 15 | 30 | 45 | 60;

export type User = {
  id: string;
  name: string;
  phone: string;
  isPro: boolean;
};

export type OnboardingState = {
  targetLevel: TargetLevel | null;
  examDate: string | null;
  dailyMinutes: DailyMinutes | null;
  reminderEnabled: boolean;
};
