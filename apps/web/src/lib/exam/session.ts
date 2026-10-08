'use client';

import { useCallback, useState } from 'react';
import { useLocale } from 'next-intl';
import { useQueryClient } from '@tanstack/react-query';
import {
  completeSection,
  createUploadQueue,
  isNetworkFailure,
  notificationKeys,
  resultKeys,
  sectionStats,
  studyKeys,
  submitSession,
  testKeys,
  useCefrClient,
  type Question,
  type ReviewLocale,
  type SectionKind,
  type SectionStats,
  type TestDetail,
} from '@cefr/core';
import { useRouter } from '@/i18n/navigation';
import { ROUTES } from '@/lib/constants';
import { useAttemptStore } from '@/lib/attempt-store';

export const uploads = createUploadQueue(useAttemptStore, async (ref) => (await fetch(ref)).blob());

export type FailureKey = 'checkInternet' | 'serverError';

export const failureKey = (error: unknown): FailureKey => (isNetworkFailure(error) ? 'checkInternet' : 'serverError');

export const useSessionControls = (test: TestDetail, section: SectionKind, questions?: Question[]) => {
  const client = useCefrClient();
  const queryClient = useQueryClient();
  const router = useRouter();
  const locale = useLocale() as ReviewLocale;
  const mode = useAttemptStore((s) => s.mode);
  const [finishing, setFinishing] = useState(false);
  const [failure, setFailure] = useState<FailureKey | null>(null);
  const [exitOpen, setExitOpen] = useState(false);
  const [finishOpen, setFinishOpen] = useState(false);
  const [stats, setStats] = useState<SectionStats>();

  const submitTest = useCallback(async () => {
    setFinishing(true);
    setFailure(null);
    try {
      const resultId = await submitSession(client, useAttemptStore, uploads, locale);
      await Promise.all(
        [resultKeys.all, testKeys.all, notificationKeys.all].map((queryKey) => queryClient.invalidateQueries({ queryKey })),
      );
      router.replace(ROUTES.result(resultId));
    } catch (error) {
      setFinishing(false);
      setFailure(failureKey(error));
    }
  }, [client, locale, queryClient, router]);

  const finish = useCallback(async () => {
    setFinishOpen(false);
    const { next, studied } = completeSection(client, useAttemptStore, test, section);
    studied.then((logged) => {
      if (logged) queryClient.invalidateQueries({ queryKey: studyKeys.all });
    });
    if (!next) {
      await submitTest();
      return;
    }
    router.replace(ROUTES.testSection(test.id, next));
  }, [client, queryClient, router, section, submitTest, test]);

  const confirmExit = useCallback(() => {
    if (mode === 'exam') {
      submitTest();
      return;
    }
    setExitOpen(false);
    router.push(ROUTES.catalog);
  }, [mode, router, submitTest]);

  const requestFinish = useCallback(() => {
    if (questions) {
      const { answers, flags } = useAttemptStore.getState();
      setStats(sectionStats(questions, answers, flags));
    }
    setFinishOpen(true);
  }, [questions]);

  return {
    test,
    section,
    mode,
    stats,
    finishing,
    failure,
    exitOpen,
    finishOpen,
    finish,
    submitTest,
    confirmExit,
    requestFinish,
    requestExit: () => setExitOpen(true),
    closeExit: () => setExitOpen(false),
    closeFinish: () => setFinishOpen(false),
  };
};

export type SessionControls = ReturnType<typeof useSessionControls>;
