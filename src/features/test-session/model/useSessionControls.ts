import { useCallback, useState } from 'react';
import { router } from 'expo-router';
import { useAttemptStore } from '@/entities/attempt';
import type { Question, SectionKind, TestDetail } from '@/entities/test';
import { sectionStats } from './stats';
import type { SectionStats } from './stats';
import { useBackGuard, useSectionFlow } from './useSectionFlow';

export const useSessionControls = (test: TestDetail, section: SectionKind, questions?: Question[]) => {
  const { finish, finishing } = useSectionFlow(test, section);
  const [exitOpen, setExitOpen] = useState(false);
  const [finishOpen, setFinishOpen] = useState(false);
  const [stats, setStats] = useState<SectionStats>();

  const requestExit = useCallback(() => setExitOpen(true), []);
  const closeExit = useCallback(() => setExitOpen(false), []);
  const closeFinish = useCallback(() => setFinishOpen(false), []);

  const confirmExit = useCallback(() => {
    setExitOpen(false);
    router.back();
  }, []);

  const requestFinish = useCallback(() => {
    if (questions) {
      const { answers, flags } = useAttemptStore.getState();
      setStats(sectionStats(questions, answers, flags));
    }
    setFinishOpen(true);
  }, [questions]);

  useBackGuard(requestExit);

  return {
    test,
    section,
    stats,
    finish,
    finishing,
    exitOpen,
    finishOpen,
    requestExit,
    closeExit,
    confirmExit,
    requestFinish,
    closeFinish,
  };
};

export type SessionControls = ReturnType<typeof useSessionControls>;
