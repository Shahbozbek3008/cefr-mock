import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { mmkvStorage } from '@/shared/lib';
import type { SectionKind } from '@/entities/test';

export type Highlight = { paragraph: string; color: 'yellow' | 'blue' };

type AttemptData = {
  attemptId: string | null;
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
  uploads: Record<string, string>;
  position: Partial<Record<SectionKind, number>>;
};

export type AttemptSnapshot = Pick<
  AttemptData,
  | 'attemptId'
  | 'testId'
  | 'section'
  | 'startedAt'
  | 'endsAt'
  | 'completed'
  | 'answers'
  | 'flags'
  | 'writing'
  | 'uploads'
>;

type AttemptActions = {
  hydrate: (snapshot: AttemptSnapshot) => void;
  enterSection: (section: SectionKind, durationSec: number) => void;
  completeSection: (section: SectionKind) => void;
  setAnswer: (questionId: string, value: string) => void;
  toggleFlag: (questionId: string) => void;
  toggleHighlight: (partId: string, highlight: Highlight) => void;
  setWriting: (taskId: string, text: string) => void;
  setRecording: (questionId: string, uri: string) => void;
  setUpload: (questionId: string, path: string) => void;
  setPosition: (section: SectionKind, index: number) => void;
  reset: () => void;
};

const empty: AttemptData = {
  attemptId: null,
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
  uploads: {},
  position: {},
};

export const useAttemptStore = create<AttemptData & AttemptActions>()(
  persist(
    (set, get) => ({
      ...empty,
      hydrate: (snapshot) => {
        if (get().attemptId === snapshot.attemptId) return;
        set({ ...empty, ...snapshot });
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
      setUpload: (questionId, path) => set((state) => ({ uploads: { ...state.uploads, [questionId]: path } })),
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

export const snapshotOf = (state: AttemptData): AttemptSnapshot => ({
  attemptId: state.attemptId,
  testId: state.testId,
  section: state.section,
  startedAt: state.startedAt,
  endsAt: state.endsAt,
  completed: state.completed,
  answers: state.answers,
  flags: state.flags,
  writing: state.writing,
  uploads: state.uploads,
});
