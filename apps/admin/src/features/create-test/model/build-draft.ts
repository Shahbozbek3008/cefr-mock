import { copyOf, createDraft, loadTest, structureOf, type TestDraft } from '@/entities/test';

export const CREATE_MODES = ['template', 'copy', 'blank'] as const;

export type CreateMode = (typeof CREATE_MODES)[number];

export type CreateTestValues = { mode: CreateMode; sourceId: string };

export const buildDraft = async ({ mode, sourceId }: CreateTestValues, number: number): Promise<TestDraft> => {
  if (mode === 'blank' || !sourceId) return createDraft(number);
  const { draft } = await loadTest(sourceId);
  return mode === 'copy' ? copyOf(draft, number) : structureOf(draft, number);
};
