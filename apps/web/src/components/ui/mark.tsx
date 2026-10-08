import type { ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/cn';
import { Icon } from './icon';

const KIND = {
  grammar: 'shadow-[inset_0_-2px_0_var(--error-500)] bg-error-50',
  lexical: 'shadow-[inset_0_-2px_0_var(--warning-500)] bg-warning-50',
  strong: 'shadow-[inset_0_-2px_0_var(--blue-500)] bg-blue-50',
  highlight: 'rounded-[3px] bg-highlight px-0.5',
  note: 'rounded-[3px] bg-blue-100 px-0.5',
} as const;

export type MarkKind = keyof typeof KIND;

export function Mark({ kind, children }: { kind: MarkKind; children: ReactNode }) {
  return <mark className={cn('text-inherit', KIND[kind])}>{children}</mark>;
}

export function Correction({ from, to, className }: { from: string; to: string; className?: string }) {
  return (
    <span className={cn('flex items-center gap-2 text-sm', className)}>
      <span className="font-mono text-error-text line-through">{from}</span>
      <Icon as={ArrowRight} size={13} strokeWidth={1.7} className="text-ink-3" />
      <span className="font-mono font-medium text-success">{to}</span>
    </span>
  );
}

export function MarkLegend({ items }: { items: readonly { kind: 'grammar' | 'lexical'; label: string }[] }) {
  return (
    <span className="flex gap-[14px] text-xs text-ink-2">
      {items.map((i) => (
        <span key={i.kind} className="flex items-center gap-1.5">
          <span className={cn('h-[3px] w-3 rounded-[2px]', i.kind === 'grammar' ? 'bg-error' : 'bg-warning')} />
          {i.label}
        </span>
      ))}
    </span>
  );
}
