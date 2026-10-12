import { Fragment } from 'react';
import { Mark } from '@cefr/ui/components/mark';
import type { AnnotatedSegment } from '@/types/results';

export function AnnotatedText({ segments }: { segments: readonly AnnotatedSegment[] }) {
  return (
    <>
      {segments.map((s, i) => {
        if (typeof s === 'string') return <Fragment key={i}>{s}</Fragment>;
        if (s.mark === 'filler') return <span key={i} className="text-ink-3">{s.text}</span>;
        return <Mark key={i} kind={s.mark}>{s.text}</Mark>;
      })}
    </>
  );
}
