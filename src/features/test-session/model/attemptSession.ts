import { useCallback, useEffect, useState } from 'react';
import { openAttempt, saveAttempt, snapshotOf, useAttemptStore } from '@/entities/attempt';
import type { AttemptMode } from '@/entities/attempt';

const AUTOSAVE_MS = 2500;

type SessionStatus = 'loading' | 'ready' | 'error';

const isOpen = (testId: string) => {
  const { testId: current, attemptId } = useAttemptStore.getState();
  return current === testId && attemptId !== null;
};

export const beginAttempt = async (testId: string, mode: AttemptMode = 'practice') => {
  if (!isOpen(testId)) useAttemptStore.getState().hydrate(await openAttempt(testId, mode));
  return useAttemptStore.getState();
};

export const flushAttempt = () => saveAttempt(snapshotOf(useAttemptStore.getState()));

export const useAttemptSession = (testId: string) => {
  const [status, setStatus] = useState<SessionStatus>(() => (isOpen(testId) ? 'ready' : 'loading'));

  const load = useCallback(() => {
    setStatus('loading');
    beginAttempt(testId)
      .then(() => setStatus('ready'))
      .catch(() => setStatus('error'));
  }, [testId]);

  useEffect(() => {
    if (!isOpen(testId)) load();
  }, [load, testId]);

  return { status, retry: load };
};

export const useAttemptAutosave = (active: boolean) => {
  useEffect(() => {
    if (!active) return;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const unsubscribe = useAttemptStore.subscribe((state, previous) => {
      if (!state.attemptId || state.attemptId !== previous.attemptId) return;
      clearTimeout(timer);
      timer = setTimeout(() => flushAttempt().catch(() => undefined), AUTOSAVE_MS);
    });

    return () => {
      clearTimeout(timer);
      unsubscribe();
      flushAttempt().catch(() => undefined);
    };
  }, [active]);
};
