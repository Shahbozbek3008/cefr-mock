'use client';

import { useTranslations } from 'next-intl';
import { Moon, Sun } from 'lucide-react';
import { cn } from '../lib/cn';
import { useTheme } from '../theme/use-theme';
import { Icon } from './icon';

export function ThemeToggle({ className }: { className?: string }) {
  const t = useTranslations('common.theme');
  const { setPreference } = useTheme();

  const toggle = () => setPreference(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');

  return (
    <button
      type="button"
      aria-label={t('toggle')}
      title={t('toggle')}
      onClick={toggle}
      className={cn(
        'grid size-8 shrink-0 place-items-center rounded-[9px] text-ink-2 transition-colors duration-(--t-fast) outline-none hover:bg-hover hover:text-ink focus-visible:shadow-focus',
        className,
      )}
    >
      <Icon as={Moon} size={16} strokeWidth={1.7} className="dark:hidden" />
      <Icon as={Sun} size={16} strokeWidth={1.7} className="hidden dark:block" />
    </button>
  );
}
