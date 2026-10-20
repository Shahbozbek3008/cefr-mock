import type { ComponentProps, ReactNode } from 'react';

export type ExamCalendarProps = {
  value?: string | null;
  defaultValue?: string | null;
  onChange?: (iso: string) => void;
  className?: string;
};

export type PanelProps = Omit<ComponentProps<'section'>, 'title'> & { title?: ReactNode; subtitle?: ReactNode; action?: ReactNode };

export type PageHeaderProps = { meta?: ReactNode; title: ReactNode; actions?: ReactNode };
