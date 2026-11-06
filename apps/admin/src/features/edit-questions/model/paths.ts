import type { QuestionSection } from '@/entities/test';

export type QuestionsPath = `${QuestionSection}.${number}.questions`;

export type QuestionPath = `${QuestionsPath}.${number}`;

export type PartChoicesPath = `${QuestionSection}.${number}.choices`;
