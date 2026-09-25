import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { mmkvStorage } from '@/shared/lib';
import type { SectionKind } from '@/entities/test';

export type Highlight = { paragraph: string; color: 'yellow' | 'blue' };

type AttemptData = {
  testId: string | null;
  section: SectionKind | null;
  startedAt: number | null;
  endsAt: Partial<Record<SectionKind, number>>;
  completed: SectionKind[];
  answers: Record<string, string>;
  flags: string[];
  highlights: Record<string, Highlight[]>;
  writing: Record<string, string>;
  writingSavedAt: number | null;
  recordings: Record<string, string>;
  position: Partial<Record<SectionKind, number>>;
};

type AttemptActions = {
  start: (testId: string) => void;
  enterSection: (section: SectionKind, durationSec: number) => void;
  completeSection: (section: SectionKind) => void;
  setAnswer: (questionId: string, value: string) => void;
  toggleFlag: (questionId: string) => void;
  toggleHighlight: (partId: string, highlight: Highlight) => void;
  setWriting: (taskId: string, text: string) => void;
  setRecording: (questionId: string, uri: string) => void;
  setPosition: (section: SectionKind, index: number) => void;
  reset: () => void;
};

const empty: AttemptData = {
  testId: null,
  section: null,
  startedAt: null,
  endsAt: {},
  completed: [],
  answers: {},
  flags: [],
  highlights: {},
  writing: {},
  writingSavedAt: null,
  recordings: {},
  position: {},
};

export const useAttemptStore = create<AttemptData & AttemptActions>()(
  persist(
    (set, get) => ({
      ...empty,
      start: (testId) => {
        if (get().testId === testId) return;
        set({ ...empty, testId, startedAt: Date.now() });
      },
      enterSection: (section, durationSec) =>
        set((state) => ({
          section,
          endsAt: state.endsAt[section]
            ? state.endsAt
            : { ...state.endsAt, [section]: Date.now() + durationSec * 1000 },
        })),
      completeSection: (section) =>
        set((state) => ({
          completed: state.completed.includes(section) ? state.completed : [...state.completed, section],
        })),
      setAnswer: (questionId, value) => set((state) => ({ answers: { ...state.answers, [questionId]: value } })),
      toggleFlag: (questionId) =>
        set((state) => ({
          flags: state.flags.includes(questionId)
            ? state.flags.filter((id) => id !== questionId)
            : [...state.flags, questionId],
        })),
      toggleHighlight: (partId, highlight) =>
        set((state) => {
          const list = state.highlights[partId] ?? [];
          const exists = list.some((h) => h.paragraph === highlight.paragraph && h.color === highlight.color);
          const next = exists
            ? list.filter((h) => !(h.paragraph === highlight.paragraph && h.color === highlight.color))
            : [...list.filter((h) => h.paragraph !== highlight.paragraph), highlight];
          return { highlights: { ...state.highlights, [partId]: next } };
        }),
      setWriting: (taskId, text) =>
        set((state) => ({ writing: { ...state.writing, [taskId]: text }, writingSavedAt: Date.now() })),
      setRecording: (questionId, uri) => set((state) => ({ recordings: { ...state.recordings, [questionId]: uri } })),
      setPosition: (section, index) => set((state) => ({ position: { ...state.position, [section]: index } })),
      reset: () => set(empty),
    }),
    {
      name: 'attempt-store',
      storage: createJSONStorage(() => mmkvStorage),
    },
  ),
);

export const useAnswer = (questionId: string) => useAttemptStore((s) => s.answers[questionId] ?? '');
export const useIsFlagged = (questionId: string) => useAttemptStore((s) => s.flags.includes(questionId));
