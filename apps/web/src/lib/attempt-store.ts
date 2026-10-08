'use client';

import { createAttemptStore } from '@cefr/core';

export const useAttemptStore = createAttemptStore(() => localStorage);

export const useAnswer = (questionId: string) => useAttemptStore((s) => s.answers[questionId] ?? '');

export const useIsFlagged = (questionId: string) => useAttemptStore((s) => s.flags.includes(questionId));
