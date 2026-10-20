import type { MarkKind } from '@cefr/ui/components/mark';

export type AnnotatedSegment = string | { text: string; mark: MarkKind | 'filler' };
