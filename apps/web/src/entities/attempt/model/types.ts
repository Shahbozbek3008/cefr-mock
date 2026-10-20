import type { Choice, McqQuestion, Question } from '@cefr/core';

export type GapInputProps = { questionId: string; number: number; variant?: 'inline' | 'field'; onFocus?: (id: string) => void };

export type McqOptionsProps = { question: McqQuestion; onAnswer?: (id: string) => void };

export type MatchChipsProps = { questionId: string; choices: Choice[]; onAnswer?: (id: string) => void };

export type QuestionNavigatorProps = { questions: Question[]; currentId: string; onSelect: (id: string) => void; className?: string };
