import type { ComponentProps, ReactNode } from 'react';
import { cn } from '@/lib/cn';

export const panelSurface = 'rounded-card-sm bg-surface shadow-[0_0_0_1px_rgba(20,22,30,.06),0_1px_2px_rgba(20,22,30,.04)]';

type PanelProps = Omit<ComponentProps<'section'>, 'title'> & { title?: ReactNode; subtitle?: ReactNode; action?: ReactNode };

export function Panel({ title, subtitle, action, className, children, ...rest }: PanelProps) {
  return (
    <section className={cn(panelSurface, 'flex flex-col', className)} {...rest}>
      {title && (
        <header className="flex items-start justify-between gap-4 px-5 pt-4">
          <div className="flex flex-col gap-0.5">
            <h2 className="m-0 text-sm font-medium tracking-[-0.01em]">{title}</h2>
            {subtitle && <span className="text-xs text-ink-3">{subtitle}</span>}
          </div>
          {action}
        </header>
      )}
      {children}
    </section>
  );
}
