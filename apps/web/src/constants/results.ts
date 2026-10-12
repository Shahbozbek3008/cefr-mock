import type { SectionKind } from '@cefr/core';

export const AI_KINDS: SectionKind[] = ['writing', 'speaking'];

export const REVIEW_STAT_KEYS = ['correct', 'wrong', 'empty'] as const;

export const ANSWER_KEYS = ['yourAnswer', 'correctAnswer'] as const;

export const SKELETON_QUESTIONS = 35;

export const STATUS_TONE = { correct: 'success', wrong: 'error', empty: 'neutral' } as const;

export const VOICES = ['narrator', 'woman', 'man', 'woman2', 'man2', 'woman3', 'man3'] as const;

export const SKELETON_CRITERIA = 4;

export const SKELETON_TIPS = 3;

export const SKELETON_ANSWERS = 2;
