import type { ReactNode } from 'react';
import { Card } from '@cefr/ui/components/card';
import { cn } from '@cefr/ui/lib/cn';

type PanelProps = {
  title?: ReactNode;
  actions?: ReactNode;
  className?: string;
  children: ReactNode;
};

export function Panel({ title, actions, className, children }: PanelProps) {
  return (
    <Card elevation="e1" radius="md" className={cn('flex flex-col', className)}>
      {(title || actions) && (
        <header className="flex flex-wrap items-center justify-between gap-2 border-b border-divider px-5 py-3">
          <h2 className="m-0 text-sm font-medium tracking-[-0.01em] text-ink">{title}</h2>
          <div className="flex flex-wrap items-center gap-2">{actions}</div>
        </header>
      )}
      <div className="p-5">{children}</div>
    </Card>
  );
}
