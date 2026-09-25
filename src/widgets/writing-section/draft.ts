import { useCallback, useEffect, useRef, useState } from 'react';
import { useAttemptStore } from '@/entities/attempt';

const AUTOSAVE_MS = 2000;

export const countWords = (text: string) => {
  const trimmed = text.trim();
  return trimmed === '' ? 0 : trimmed.split(/\s+/).length;
};

export const savedLabel = (savedAt: number | null, now: number) => {
  if (!savedAt) return 'Qoralama avtomatik saqlanadi';
  const seconds = Math.max(1, Math.round((now - savedAt) / 1000));
  if (seconds < 60) return `Qoralama ${seconds} soniya oldin saqlandi`;
  return `Qoralama ${Math.round(seconds / 60)} daqiqa oldin saqlandi`;
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
