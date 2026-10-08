import { createAttemptStore } from '@cefr/core';
import { mmkvStorage } from '@/shared/lib';

export { snapshotOf } from '@cefr/core';
export type { AttemptMode, AttemptSnapshot, Highlight } from '@cefr/core';

export const useAttemptStore = createAttemptStore(() => mmkvStorage);

export const useAnswer = (questionId: string) => useAttemptStore((s) => s.answers[questionId] ?? '');
export const useIsFlagged = (questionId: string) => useAttemptStore((s) => s.flags.includes(questionId));
