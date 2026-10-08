import type { MarkKind } from '@/components/ui/mark';

export type Segment = string | { text: string; mark: MarkKind };

export const ESSAY = {
  words: 262,
  score: 52,
  grammarErrors: 6,
  lexicalIssues: 4,
  paragraphs: [
    [
      'Many people ', { text: 'believes', mark: 'grammar' }, ' that public transport is the key to a sustainable city. Buses and trains ',
      { text: 'moves', mark: 'grammar' }, ' more people with less space and fewer emissions than private cars, which is why many governments are investing heavily in metro systems.',
    ],
    [
      'On the other hand, some argue that roads remain essential for deliveries and emergency services. Roads are ', { text: 'very important', mark: 'lexical' },
      ' especially in growing suburbs where ', { text: 'there is not', mark: 'grammar' }, ' enough public transport, and people ',
      { text: 'have to use', mark: 'lexical' }, ' their cars every day.',
    ],
  ] satisfies readonly (readonly Segment[])[],
  corrections: [
    { kind: 'grammar', from: 'believes', to: 'believe', noteKey: 'peoplePlural' },
    { kind: 'lexical', from: 'very important', to: 'crucial', noteKey: 'strongerAdjective' },
  ],
} as const;

export const SPEAKING = {
  part: '1.2',
  score: 46,
  max: 60,
  total: 62,
  position: '0:21',
  duration: '0:58',
  stats: { words: 112, wpm: 116, pauses: 4 },
  transcript: [
    'In the picture I can see a busy market. ', { text: 'Um…', mark: 'filler' }, ' People ', { text: 'is buying', mark: 'lexical' },
    ' fresh vegetables and they look quite happy. ', { text: 'I think people go to places like this', mark: 'strong' },
    " because it's more affordable than supermarkets, ", { text: 'uh…', mark: 'filler' },
    ' and the products are more fresh. Also, markets are a good place to meet neighbours and…',
  ] as readonly (string | { text: string; mark: MarkKind | 'filler' })[],
  feedback: [
    { tone: 'success', key: 'clear' },
    { tone: 'warning', key: 'fillers' },
    { tone: 'warning', key: 'comparative' },
  ],
} as const;
