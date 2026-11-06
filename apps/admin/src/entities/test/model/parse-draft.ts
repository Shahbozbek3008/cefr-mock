import { hydrateDraft } from './mappers';
import type { TestDraft } from './types';

export type DraftParseError = { code: 'invalidJson' | 'notObject' | 'notArray'; key?: string };

const SECTION_KEYS = ['listening', 'reading', 'writing', 'speaking'] as const;

export const parseDraft = (source: string): { draft: TestDraft } | { error: DraftParseError } => {
  let value: unknown;
  try {
    value = JSON.parse(source);
  } catch {
    return { error: { code: 'invalidJson' } };
  }
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return { error: { code: 'notObject' } };

  const record = value as Record<string, unknown>;
  const missing = SECTION_KEYS.find((key) => !Array.isArray(record[key]));
  if (missing) return { error: { code: 'notArray', key: missing } };

  return { draft: hydrateDraft(record as Partial<TestDraft>) };
};
