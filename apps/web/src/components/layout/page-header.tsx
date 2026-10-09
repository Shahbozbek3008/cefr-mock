import type { ReactNode } from 'react';
import { PageTitle } from '@/components/ui/typography';

type PageHeaderProps = { meta?: ReactNode; title: ReactNode; actions?: ReactNode };

export function PageHeader({ meta, title, actions }: PageHeaderProps) {
  return (
    <div className="flex items-end justify-between gap-5">
      <PageTitle meta={meta} title={title} />
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

export function AppMain({ children, className = 'gap-5' }: { children: ReactNode; className?: string }) {
  return <main className={`stagger flex min-w-0 flex-1 flex-col px-4 py-5 sm:px-6 lg:px-10 lg:py-7 ${className}`}>{children}</main>;
}
