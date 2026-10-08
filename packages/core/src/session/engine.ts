import { useCallback, useEffect, useState } from 'react';
import type { StoreApi, UseBoundStore } from 'zustand';
import { useCefrClient, type CefrClient } from '../api/client';
import { openAttempt, saveAttempt, submitAttempt, uploadRecording } from '../attempt/api';
import { snapshotOf, type AttemptMode, type AttemptState } from '../attempt/store';
import { requestAiReview, type ReviewLocale } from '../result/api';
import { logStudy } from '../study/api';
import { sectionOrder } from '../test/sections';
import type { SectionKind, TestDetail } from '../test/types';

export type AttemptStore = UseBoundStore<StoreApi<AttemptState>>;

export type RecordingSource = (ref: string) => Promise<ArrayBuffer | Blob>;

const AUTOSAVE_MS = 2500;

export const nextSection = (section: SectionKind) => sectionOrder[sectionOrder.indexOf(section) + 1] ?? null;

export const isAttemptOpen = (store: AttemptStore, testId: string) => {
  const { testId: current, attemptId } = store.getState();
  return current === testId && attemptId !== null;
};

export const beginAttempt = async (client: CefrClient, store: AttemptStore, testId: string, mode: AttemptMode = 'practice') => {
  if (!isAttemptOpen(store, testId)) store.getState().hydrate(await openAttempt(client, testId, mode));
  return store.getState();
};

export const flushAttempt = (client: CefrClient, store: AttemptStore) => saveAttempt(client, snapshotOf(store.getState()));

export const createUploadQueue = (store: AttemptStore, load: RecordingSource) => {
  const pending = new Map<string, Promise<void>>();

  const upload = (client: CefrClient, questionId: string, ref: string) => {
    const { attemptId } = store.getState();
    if (!attemptId) return;

    const task = load(ref)
      .then((body) => uploadRecording(client, attemptId, questionId, body))
      .then((path) => {
        const state = store.getState();
        if (state.attemptId === attemptId && state.recordings[questionId] === ref) state.setUpload(questionId, path);
      })
      .finally(() => {
        if (pending.get(questionId) === task) pending.delete(questionId);
      });

    pending.set(questionId, task);
    task.catch(() => undefined);
  };

  const flush = async (client: CefrClient) => {
    await Promise.allSettled(pending.values());
    const { recordings, uploads } = store.getState();
    Object.entries(recordings)
      .filter(([questionId, ref]) => ref && !uploads[questionId])
      .forEach(([questionId, ref]) => upload(client, questionId, ref));
    await Promise.all(pending.values());
  };

  return { upload, flush };
};

export type UploadQueue = ReturnType<typeof createUploadQueue>;

export const completeSection = (client: CefrClient, store: AttemptStore, test: TestDetail, section: SectionKind) => {
  const { endsAt } = store.getState();
  const limitSec = (test.sections.find((item) => item.kind === section)?.minutes ?? 0) * 60;
  const remainingSec = Math.max(0, ((endsAt[section] ?? Date.now()) - Date.now()) / 1000);
  const studied = logStudy(client, Math.max(0, limitSec - remainingSec)).catch(() => false);
  store.getState().completeSection(section);
  const next = nextSection(section);
  if (next) flushAttempt(client, store).catch(() => undefined);
  return { next, studied };
};

export const submitSession = async (client: CefrClient, store: AttemptStore, uploads: UploadQueue, locale: ReviewLocale) => {
  await uploads.flush(client);
  await flushAttempt(client, store);
  const { attemptId } = store.getState();
  if (!attemptId) throw new Error('attempt_missing');
  const resultId = await submitAttempt(client, attemptId);
  requestAiReview(client, resultId, locale).catch(() => undefined);
  store.getState().reset();
  return resultId;
};

type SessionStatus = 'loading' | 'ready' | 'error';

export const useAttemptSession = (store: AttemptStore, testId: string) => {
  const client = useCefrClient();
  const [status, setStatus] = useState<SessionStatus>(() => (isAttemptOpen(store, testId) ? 'ready' : 'loading'));
  const [error, setError] = useState<unknown>(null);

  const load = useCallback(() => {
    setStatus('loading');
    beginAttempt(client, store, testId)
      .then(() => setStatus('ready'))
      .catch((failure) => {
        setError(failure);
        setStatus('error');
      });
  }, [client, store, testId]);

  useEffect(() => {
    if (!isAttemptOpen(store, testId)) load();
  }, [load, store, testId]);

  return { status, error, retry: load };
};

export const useAttemptAutosave = (store: AttemptStore, active: boolean) => {
  const client = useCefrClient();
  useEffect(() => {
    if (!active) return;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const unsubscribe = store.subscribe((state, previous) => {
      if (!state.attemptId || state.attemptId !== previous.attemptId) return;
      clearTimeout(timer);
      timer = setTimeout(() => flushAttempt(client, store).catch(() => undefined), AUTOSAVE_MS);
    });

    return () => {
      clearTimeout(timer);
      unsubscribe();
      flushAttempt(client, store).catch(() => undefined);
    };
  }, [active, client, store]);
};
