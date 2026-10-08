import type { ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { ChevronLeft } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/cn';
import { Icon } from '@/components/ui/icon';
import { Logo } from '@/components/ui/logo';
import { Grow } from '@/components/motion/grow';

export function BackLink({ href }: { href: string }) {
  const t = useTranslations('auth');
  return (
    <Link href={href} className="group flex h-[38px] items-center gap-1.5 rounded-[11px] bg-surface pr-[14px] pl-2.5 text-sm text-ink-body shadow-inset transition-colors hover:bg-bg-app hover:text-ink">
      <Icon as={ChevronLeft} size={16} strokeWidth={1.75} className="transition-transform duration-(--t-base) ease-out-expo group-hover:-translate-x-0.5" />
      {t('back')}
    </Link>
  );
}

type StepIndicatorProps = { current: number; total?: number; partial?: boolean };

export function StepIndicator({ current, total = 3, partial = false }: StepIndicatorProps) {
  const t = useTranslations('onboarding');
  return (
    <div className="flex items-center gap-[14px] text-[13px] text-ink-2">
      <span className="font-mono">{t('step', { current, total })}</span>
      <div className="grid grid-cols-[repeat(3,48px)] gap-1" aria-hidden>
        {Array.from({ length: total }, (_, i) => (
          <span key={i} className="h-1 overflow-hidden rounded-[2px] bg-divider-page">
            {i < current && <Grow width="100%" delay={i * 0.18} className={cn('h-full', i < current - (partial ? 1 : 0) ? 'bg-green' : 'bg-green-300')} />}
          </span>
        ))}
      </div>
    </div>
  );
}

const SPACER = <span className="w-[90px]" aria-hidden />;

export function AuthTopBar({ start = <Logo />, center, end = SPACER, className }: { start?: ReactNode; center?: ReactNode; end?: ReactNode; className?: string }) {
  return (
    <div className={cn('relative z-10 flex h-18 shrink-0 items-center justify-between px-5 md:px-10', className)}>
      {start}
      {center}
      {end}
    </div>
  );
}
