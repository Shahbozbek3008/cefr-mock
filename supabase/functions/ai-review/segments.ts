export type Mark = 'grammar' | 'lexis' | 'filler' | 'good';

export type Segment = { text: string; mark?: Mark };

type RawSegment = { text: string; mark: Mark | 'none' };

const squash = (value: string) => value.replace(/\s+/g, ' ').trim();

export const alignSegments = (original: string, raw: RawSegment[]): Segment[] => {
  const segments = raw
    .filter((segment) => segment.text.length > 0)
    .map(({ text, mark }) => (mark === 'none' ? { text } : { text, mark }));
  const rebuilt = segments.map((segment) => segment.text).join('');
  return squash(rebuilt) === squash(original) ? segments : [{ text: original }];
};

export const segmentSchema = (marks: string[]) => ({
  type: 'array',
  items: {
    type: 'object',
    additionalProperties: false,
    required: ['text', 'mark'],
    properties: {
      text: { type: 'string' },
      mark: { type: 'string', enum: [...marks, 'none'] },
    },
  },
});

export const countWords = (text: string) => {
  const trimmed = text.trim();
  return trimmed ? trimmed.split(/\s+/).length : 0;
};

export const levelFor = (score: number) => {
  if (score >= 65) return 'C1';
  if (score >= 51) return 'B2';
  if (score >= 38) return 'B1';
  return 'A2';
};

export const MAX_SCORE = 75;
