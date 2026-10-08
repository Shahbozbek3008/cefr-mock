import { Fragment } from 'react';
import { Mark, type MarkKind } from '@/components/ui/mark';

type Segment = string | { text: string; mark: MarkKind | 'filler' };

export function AnnotatedText({ segments }: { segments: readonly Segment[] }) {
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
