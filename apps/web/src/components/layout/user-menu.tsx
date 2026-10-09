'use client';

import { useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { DropdownMenu } from 'radix-ui';
import { ChevronsUpDown, CreditCard, LogOut, Settings } from 'lucide-react';
import { formatPhone, useProfile, useUpdateProfile, type Locale } from '@cefr/core';
import { Link } from '@/i18n/navigation';
import { ROUTES } from '@/lib/constants';
import { cn } from '@/lib/cn';
import { useSignOut } from '@/lib/supabase/sign-out';
import { Icon } from '@/components/ui/icon';
import { Avatar } from '@/components/ui/avatar';
import { Skeleton, SkeletonText } from '@/components/ui/skeleton';
import { menuContent, menuItem, menuSeparator } from '@/components/ui/menu';

const LINKS = [
  { key: 'settings', href: ROUTES.settings, icon: Settings },
  { key: 'billing', href: ROUTES.billing, icon: CreditCard },
] as const;

const phoneLabel = (phone: string | null) => (phone ? `+998 ${formatPhone(phone.replace(/^\+998/, ''))}` : '');

export function UserMenu({ collapsed = false }: { collapsed?: boolean }) {
  const t = useTranslations('app');
  const locale = useLocale() as Locale;
  const signOut = useSignOut();
  const { mutate: updateProfile } = useUpdateProfile();
  const { data: profile } = useProfile();
  const fullName = [profile?.firstName, profile?.lastName].filter(Boolean).join(' ');
  const initial = (profile?.firstName || '?').charAt(0).toUpperCase();

  useEffect(() => {
    if (profile && profile.locale !== locale) updateProfile({ locale });
  }, [locale, profile, updateProfile]);

  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger
        aria-label={t('user.menu')}
        className={cn(
          'group flex items-center gap-2.5 rounded-[11px] text-left transition-colors duration-(--t-fast) outline-none hover:bg-hover focus-visible:shadow-focus data-[state=open]:bg-hover',
          collapsed ? 'mx-auto p-1' : 'w-full p-1.5',
        )}
      >
        {profile ? <Avatar initial={initial} size={32} src={profile.avatarUrl} /> : <Skeleton className="size-8 shrink-0 rounded-full" />}
        {!collapsed && (
          <>
            {profile ? (
              <span className="flex min-w-0 flex-1 flex-col leading-[1.3]">
                <span className="truncate text-[13px] font-medium text-ink">{fullName || phoneLabel(profile.phone)}</span>
                <span className="truncate text-[11px] text-ink-3">{t(`plan.${profile.isPro ? 'pro' : 'free'}`)}</span>
              </span>
            ) : (
              <span className="flex min-w-0 flex-1 flex-col leading-[1.3]">
                <SkeletonText className="w-24 text-[13px]" />
                <SkeletonText className="w-12 text-[11px]" />
              </span>
            )}
            <Icon as={ChevronsUpDown} size={14} strokeWidth={1.6} className="text-ink-3" />
          </>
        )}
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          side={collapsed ? 'right' : 'top'}
          align={collapsed ? 'end' : 'start'}
          sideOffset={collapsed ? 12 : 8}
          className={cn(menuContent, collapsed ? 'w-[220px]' : 'w-(--radix-dropdown-menu-trigger-width)')}
        >
          <div className="flex flex-col px-2.5 pt-1.5 pb-2">
            <span className="text-[13px] font-medium">{fullName}</span>
            <span className="font-mono text-[11px] text-ink-3">{phoneLabel(profile?.phone ?? null)}</span>
          </div>
          <DropdownMenu.Separator className={menuSeparator} />
          {LINKS.map((l) => (
            <DropdownMenu.Item key={l.key} asChild className={menuItem}>
              <Link href={l.href}>
                <Icon as={l.icon} size={15} strokeWidth={1.6} />
                {t(`user.${l.key}`)}
              </Link>
            </DropdownMenu.Item>
          ))}
          <DropdownMenu.Separator className={menuSeparator} />
          <DropdownMenu.Item onSelect={() => signOut()} className={cn(menuItem, 'data-highlighted:bg-error-50 data-highlighted:text-error-text')}>
            <Icon as={LogOut} size={15} strokeWidth={1.6} />
            {t('user.logout')}
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
