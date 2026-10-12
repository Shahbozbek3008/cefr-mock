import { useEffect } from 'react';
import { fetchProfile, updateProfile, useUserStore } from '@/entities/user/model';
import type { ProfilePatch } from '@/entities/user/model';
import { useLocaleStore } from '@/shared/i18n';

const SYNC_DELAY_MS = 800;

type Synced = Required<Pick<ProfilePatch, 'targetLevel' | 'examDate' | 'dailyMinutes' | 'reminderEnabled'>>;

const pick = (state: ReturnType<typeof useUserStore.getState>): Synced => ({
  targetLevel: state.targetLevel,
  examDate: state.examDate,
  dailyMinutes: state.dailyMinutes,
  reminderEnabled: state.reminderEnabled,
});

const diff = (next: Synced, previous: Synced): ProfilePatch =>
  Object.fromEntries(
    (Object.keys(next) as (keyof Synced)[]).filter((key) => next[key] !== previous[key]).map((key) => [key, next[key]]),
  );

const useLocaleSync = () => {
  const locale = useLocaleStore((s) => s.locale);

  useEffect(() => {
    updateProfile({ locale }).catch(() => undefined);
  }, [locale]);
};

export const useProfileSync = () => {
  useLocaleSync();

  useEffect(() => {
    let synced = pick(useUserStore.getState());
    let timer: ReturnType<typeof setTimeout> | undefined;

    fetchProfile()
      .then((profile) => {
        useUserStore.getState().applyProfile(profile);
        synced = pick(useUserStore.getState());
      })
      .catch(() => undefined);

    const unsubscribe = useUserStore.subscribe((state) => {
      if (!state.user) return;
      clearTimeout(timer);
      timer = setTimeout(() => {
        const next = pick(useUserStore.getState());
        const patch = diff(next, synced);
        if (Object.keys(patch).length === 0) return;
        updateProfile(patch)
          .then(() => {
            synced = next;
          })
          .catch(() => undefined);
      }, SYNC_DELAY_MS);
    });

    return () => {
      clearTimeout(timer);
      unsubscribe();
    };
  }, []);
};
