import type { ReactNode } from 'react';
import { cn } from '@cefr/ui/lib/cn';

export type NoticeTone = 'neutral' | 'success' | 'warning' | 'error';

const TONES: Record<NoticeTone, string> = {
  neutral: 'bg-surface-sunken text-ink-2',
  success: 'bg-success-50 text-success',
  warning: 'bg-warning-50 text-warning-text',
  error: 'bg-error-50 text-error-text',
};

export function Notice({ tone = 'neutral', children }: { tone?: NoticeTone; children: ReactNode }) {
  return <div className={cn('rounded-card-sm px-4 py-3 text-sm', TONES[tone])}>{children}</div>;
}
