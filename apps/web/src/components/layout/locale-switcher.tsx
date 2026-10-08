'use client';

import { useTransition } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { DropdownMenu } from 'radix-ui';
import { Check, ChevronsUpDown, Globe } from 'lucide-react';
import { usePathname, useRouter } from '@/i18n/navigation';
import { routing, type Locale } from '@/i18n/routing';
import { cn } from '@/lib/cn';
import { Icon } from '@/components/ui/icon';
import { menuContent, menuItem } from '@/components/ui/menu';

const NAMES: Record<Locale, string> = {
  uz: "O'zbekcha",
  ru: 'Русский',
  en: 'English',
};

type LocaleSwitcherProps = {
  variant?: 'compact' | 'full';
  align?: 'start' | 'end';
  side?: 'top' | 'bottom';
  className?: string;
};

export function LocaleSwitcher({ variant = 'full', align = 'end', side = 'bottom', className }: LocaleSwitcherProps) {
  const t = useTranslations('common');
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const change = (next: string) => {
    if (next !== locale) startTransition(() => router.replace(pathname, { locale: next as Locale }));
  };

  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger
        aria-label={t('language')}
        className={cn(
          'inline-flex h-8 shrink-0 items-center gap-1.5 rounded-[9px] px-2 text-[13px] text-ink-2 transition-colors duration-(--t-fast) outline-none hover:bg-hover hover:text-ink focus-visible:shadow-focus data-[state=open]:bg-hover data-[state=open]:text-ink',
          pending && 'opacity-60',
          className,
        )}
      >
        <Icon as={Globe} size={14} strokeWidth={1.6} />
        <span>{variant === 'compact' ? locale.toUpperCase() : NAMES[locale]}</span>
        <Icon as={ChevronsUpDown} size={12} strokeWidth={1.6} className="text-ink-3" />
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align={align}
          side={side}
          sideOffset={6}
          className={menuContent}
        >
          <DropdownMenu.RadioGroup value={locale} onValueChange={change}>
            {routing.locales.map((l) => (
              <DropdownMenu.RadioItem
                key={l}
                value={l}
                lang={l}
                className={cn(menuItem, 'justify-between gap-4')}
              >
                {NAMES[l]}
                <DropdownMenu.ItemIndicator>
                  <Icon as={Check} size={14} strokeWidth={2} className="text-ink" />
                </DropdownMenu.ItemIndicator>
              </DropdownMenu.RadioItem>
            ))}
          </DropdownMenu.RadioGroup>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
