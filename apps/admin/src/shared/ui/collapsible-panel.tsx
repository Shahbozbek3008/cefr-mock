import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { Card } from '@cefr/ui/components/card';
import { cn } from '@cefr/ui/lib/cn';

type CollapsiblePanelProps = {
  title: ReactNode;
  meta?: ReactNode;
  actions?: ReactNode;
  defaultOpen?: boolean;
  className?: string;
  children: ReactNode;
};

export function CollapsiblePanel({ title, meta, actions, defaultOpen, className, children }: CollapsiblePanelProps) {
  return (
    <Card elevation="e1" radius="md" className={cn('overflow-hidden', className)}>
      <details open={defaultOpen} className="group">
        <summary className="flex cursor-pointer list-none flex-wrap items-center gap-3 px-5 py-3 [&::-webkit-details-marker]:hidden">
          <ChevronDown size={16} className="shrink-0 text-ink-3 transition-transform duration-(--t-base) group-open:rotate-180" />
          <h2 className="m-0 text-sm font-medium tracking-[-0.01em] text-ink">{title}</h2>
          {meta}
          <div className="ml-auto flex items-center gap-2" onClick={(event) => event.preventDefault()}>
            {actions}
          </div>
        </summary>
        <div className="border-t border-divider p-5">{children}</div>
      </details>
    </Card>
  );
}
