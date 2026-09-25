import { useCallback, useEffect, useRef, useState } from 'react';
import { useAttemptStore } from '@/entities/attempt';
import type { TKey } from '@/shared/i18n';

const AUTOSAVE_MS = 2000;

export const countWords = (text: string) => {
  const trimmed = text.trim();
  return trimmed === '' ? 0 : trimmed.split(/\s+/).length;
};

export const savedStatus = (savedAt: number | null, now: number): { key: TKey; count?: number } => {
  if (!savedAt) return { key: 'writing.savedAuto' };
  const seconds = Math.max(1, Math.round((now - savedAt) / 1000));
  if (seconds < 60) return { key: 'writing.savedSeconds', count: seconds };
  return { key: 'writing.savedMinutes', count: Math.round(seconds / 60) };
};

export const useDrafts = () => {
  const setWriting = useAttemptStore((s) => s.setWriting);
  const [drafts, setDrafts] = useState(() => useAttemptStore.getState().writing);
  const latest = useRef(drafts);
  latest.current = drafts;

  const update = useCallback((taskId: string, text: string) => {
    setDrafts((current) => ({ ...current, [taskId]: text }));
  }, []);

  const flush = useCallback(() => {
    const saved = useAttemptStore.getState().writing;
    Object.entries(latest.current).forEach(([taskId, text]) => {
      if (saved[taskId] !== text) setWriting(taskId, text);
    });
    return latest.current;
  }, [setWriting]);

  useEffect(() => {
    const timer = setTimeout(flush, AUTOSAVE_MS);
    return () => clearTimeout(timer);
  }, [drafts, flush]);

  useEffect(() => () => void flush(), [flush]);

  return { drafts, update, flush };
};
