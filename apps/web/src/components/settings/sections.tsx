import type { ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { DAILY_MINUTES } from '@cefr/core';
import { Calendar, Check, Mail, MessageSquare, Monitor, Smartphone, Tablet } from 'lucide-react';
import { LEVELS, ROUTES } from '@/lib/constants';
import { MOCK_EXAM, MOCK_USER } from '@/lib/mock/user';
import { PAYMENT_METHODS, RECOMMENDED_PLAN } from '@/lib/mock/plans';
import { CHANNELS, NOTIFICATIONS, PAYMENTS, REMINDER_TIME, SESSIONS } from '@/lib/mock/settings';
import { formatSum } from '@/lib/format';
import { cn } from '@/lib/cn';
import { Tag } from '@/components/ui/tag';
import { Icon } from '@/components/ui/icon';
import { Avatar } from '@/components/ui/avatar';
import { LogoMark } from '@/components/ui/logo';
import { Button, ButtonLink } from '@/components/ui/button';
import { Switch } from '@/components/ui/controls';
import { Field, TextInput } from '@/components/ui/field';
import { TelegramIcon } from '@/components/ui/brand-icons';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { LocaleSwitcher } from '@/components/layout/locale-switcher';
import { Panel } from '@/components/dashboard/panel';

const compactButton = 'h-9 rounded-[10px] px-3.5 text-[13px]';

function Rows({ children }: { children: ReactNode }) {
  return <div className="flex flex-col px-5 pt-1 pb-1">{children}</div>;
}

function SettingRow({ title, hint, icon, children }: { title: string; hint: ReactNode; icon?: ReactNode; children: ReactNode }) {
  return (
    <div className="flex min-h-16 items-center gap-4 py-3 shadow-[0_1px_0_var(--divider)] last:shadow-none">
      {icon}
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="text-sm">{title}</span>
        <span className="text-xs text-ink-3">{hint}</span>
      </div>
      {children}
    </div>
  );
}

function IconTile({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn('grid size-9 shrink-0 place-items-center rounded-[10px] bg-surface-sunken text-ink-2', className)}>{children}</span>;
}

function FormActions() {
  const t = useTranslations('settings');
  return (
    <div className="flex justify-end gap-2 pt-1">
      <Button variant="secondary" size="xs" className={compactButton}>{t('cancel')}</Button>
      <Button size="xs" className={compactButton}>{t('save')}</Button>
    </div>
  );
}

export function ProfileSection() {
  const t = useTranslations('settings');
  return (
    <>
      <Panel title={t('profile.title')} subtitle={t('profile.subtitle')}>
        <div className="flex flex-col gap-5 p-5">
          <div className="flex items-center gap-4">
            <Avatar initial={MOCK_USER.initial} size={64} />
            <div className="flex flex-1 flex-col gap-0.5">
              <span className="text-[15px] font-medium">{MOCK_USER.firstName} {MOCK_USER.lastName}</span>
              <span className="text-xs text-ink-3">{t('profile.since')}</span>
            </div>
            <Button variant="secondary" size="xs" className={compactButton}>{t('profile.changePhoto')}</Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={t('profile.firstName')} htmlFor="firstName"><TextInput size="md" id="firstName" defaultValue={MOCK_USER.firstName} /></Field>
            <Field label={t('profile.lastName')} htmlFor="lastName"><TextInput size="md" id="lastName" defaultValue={MOCK_USER.lastName} /></Field>
            <Field label={t('profile.phone')} htmlFor="phone">
              <TextInput
                size="md"
                readOnly
                id="phone"
                defaultValue={`+998 ${MOCK_USER.phone}`}
                className="font-mono"
                suffix={<Tag tone="success"><Icon as={Check} size={11} strokeWidth={2.5} />{t('profile.verified')}</Tag>}
              />
            </Field>
            <Field label={t('profile.email')} htmlFor="email"><TextInput size="md" id="email" type="email" placeholder={t('profile.optional')} /></Field>
          </div>
        </div>
      </Panel>
      <Panel title={t('interface.title')} subtitle={t('interface.subtitle')}>
        <Rows>
          <SettingRow title={t('preferences.language')} hint={t('preferences.languageHint')}>
            <LocaleSwitcher className="h-9 rounded-[10px] px-3 shadow-inset" />
          </SettingRow>
          <SettingRow title={t('preferences.theme')} hint={t('preferences.themeHint')}>
            <SegmentedControl label={t('preferences.theme')} defaultValue="light" className="h-9 w-[240px] rounded-[10px] text-xs [&>button]:rounded-[7px]" options={(['light', 'dark', 'system'] as const).map((v) => ({ value: v, label: t(`preferences.themes.${v}`) }))} />
          </SettingRow>
        </Rows>
      </Panel>
      <FormActions />
    </>
  );
}

export function ExamSection() {
  const t = useTranslations('settings');
  const tc = useTranslations('common');
  const td = useTranslations('onboarding.date.options');
  return (
    <>
      <Panel title={t('exam.title')} subtitle={t('exam.subtitle')}>
        <Rows>
          <SettingRow title={t('preferences.target')} hint={t('preferences.targetHint')}>
            <SegmentedControl label={t('preferences.target')} defaultValue={MOCK_EXAM.target} className="h-9 w-[168px] rounded-[10px] text-xs [&>button]:rounded-[7px]" options={LEVELS.map((l) => ({ value: l.code, label: l.code }))} />
          </SettingRow>
          <SettingRow title={t('preferences.examDate')} hint={t('preferences.daysLeft', { days: MOCK_EXAM.daysLeft })}>
            <Button variant="secondary" size="xs" icon={<Icon as={Calendar} size={14} />} className={compactButton}>{tc('examDate')}</Button>
          </SettingRow>
          <SettingRow title={t('exam.daily')} hint={t('exam.dailyHint')}>
            <SegmentedControl label={t('exam.daily')} defaultValue="30" className="h-9 w-[280px] rounded-[10px] text-xs [&>button]:rounded-[7px] [&>button]:px-2" options={DAILY_MINUTES.map((m) => ({ value: String(m), label: td('minutes', { count: m }) }))} />
          </SettingRow>
        </Rows>
      </Panel>
      <FormActions />
    </>
  );
}

const CHANNEL_ICONS = {
  sms: <Icon as={MessageSquare} size={16} strokeWidth={1.7} />,
  telegram: <TelegramIcon size={16} />,
  email: <Icon as={Mail} size={16} strokeWidth={1.7} />,
} as const;

export function NotificationsSection() {
  const t = useTranslations('settings.notifications');
  return (
    <>
      <Panel title={t('title')} subtitle={t('subtitle')}>
        <Rows>
          {NOTIFICATIONS.map((n) => (
            <SettingRow key={n.key} title={t(`items.${n.key}.title`)} hint={t(`items.${n.key}.hint`, { time: REMINDER_TIME })}>
              <Switch label={t(`items.${n.key}.title`)} defaultChecked={n.enabled} />
            </SettingRow>
          ))}
        </Rows>
      </Panel>
      <Panel title={t('channels.title')} subtitle={t('channels.subtitle')}>
        <Rows>
          {CHANNELS.map((c) => (
            <SettingRow key={c.key} title={t(`channels.${c.key}`)} hint={c.key === 'sms' ? `+998 ${MOCK_USER.phone}` : c.key === 'telegram' ? '@aziza_k' : '—'} icon={<IconTile>{CHANNEL_ICONS[c.key]}</IconTile>}>
              <Switch label={t(`channels.${c.key}`)} defaultChecked={c.enabled} />
            </SettingRow>
          ))}
        </Rows>
      </Panel>
      <FormActions />
    </>
  );
}

export function SubscriptionSection() {
  const t = useTranslations('settings.subscription');
  const tp = useTranslations('plans');
  const tb = useTranslations('billing');
  const click = PAYMENT_METHODS[0];
  const columns = 'grid-cols-[96px_minmax(0,1fr)_96px_88px_56px]';

  return (
    <>
      <Panel>
        <div className="flex flex-wrap items-center gap-4 p-5">
          <span className="grid size-11 shrink-0 place-items-center rounded-[12px] bg-surface shadow-[0_0_0_1px_var(--border),0_4px_10px_-6px_rgba(20,22,30,.2)]">
            <LogoMark size="md" />
          </span>
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <span className="flex items-center gap-2 text-[15px] font-medium">
              {tb('title')} · {tp(`${RECOMMENDED_PLAN}.name`)}
              <Tag tone="success" size="sm">{t('active')}</Tag>
            </span>
            <span className="text-xs text-ink-3">{t('renews', { date: tb(`validity.${RECOMMENDED_PLAN}`) })}</span>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="xs" className={`${compactButton} text-error-text hover:bg-error-50 hover:text-error-text`}>{t('cancel')}</Button>
            <ButtonLink href={ROUTES.billing} variant="secondary" size="xs" className={compactButton}>{t('change')}</ButtonLink>
          </div>
        </div>
      </Panel>
      <Panel>
        <Rows>
          <SettingRow
            title={t('method')}
            hint={t('methodHint')}
            icon={<span className="grid size-9 shrink-0 place-items-center rounded-[10px] text-xs font-semibold text-white" style={{ background: click.color }}>{click.letter}</span>}
          >
            <span className="font-mono text-xs text-ink-2 max-sm:hidden">{click.name} · +998 90 ••• •• 67</span>
            <Button variant="secondary" size="xs" className={compactButton}>{t('update')}</Button>
          </SettingRow>
        </Rows>
      </Panel>
      <Panel title={t('history')} subtitle={t('historySubtitle')}>
        <div className="flex flex-col px-3 pt-3 pb-2">
          <div className={`grid ${columns} gap-4 px-3 pb-2 text-[11px] font-medium text-ink-3 shadow-[0_1px_0_var(--divider)]`}>
            <span>{t('columns.date')}</span>
            <span>{t('columns.plan')}</span>
            <span>{t('columns.amount')}</span>
            <span>{t('columns.status')}</span>
            <span />
          </div>
          {PAYMENTS.map((p) => (
            <div key={p.date} className={`grid ${columns} h-12 items-center gap-4 rounded-[10px] px-3 text-[13px] transition-colors duration-(--t-fast) hover:bg-surface-muted`}>
              <span className="font-mono text-xs text-ink-2">{p.date}</span>
              <span className="truncate">Pro · {tp(`${p.plan}.name`)}</span>
              <span className="font-mono text-xs">{formatSum(p.amount)}</span>
              <Tag tone="success" size="sm" className="justify-self-start">{t('paid')}</Tag>
              <button type="button" className="justify-self-end text-xs font-medium text-green-text hover:text-green-hover">{t('receipt')}</button>
            </div>
          ))}
        </div>
      </Panel>
    </>
  );
}

const SESSION_ICONS = { desktop: Monitor, phone: Smartphone, tablet: Tablet } as const;

export function SecuritySection() {
  const t = useTranslations('settings.security');
  const tp = useTranslations('settings.profile');
  return (
    <>
      <Panel>
        <Rows>
          <SettingRow
            title={t('phone.title')}
            hint={t('phone.hint')}
            icon={<IconTile><Icon as={Smartphone} size={16} strokeWidth={1.7} /></IconTile>}
          >
            <span className="flex items-center gap-2 max-sm:hidden">
              <span className="font-mono text-xs">+998 {MOCK_USER.phone}</span>
              <Tag tone="success" size="sm"><Icon as={Check} size={10} strokeWidth={2.5} />{tp('verified')}</Tag>
            </span>
            <Button variant="secondary" size="xs" className={compactButton}>{t('phone.change')}</Button>
          </SettingRow>
        </Rows>
      </Panel>
      <Panel
        title={t('sessions.title')}
        subtitle={t('sessions.subtitle')}
        action={<Button variant="ghost" size="xs" className={`${compactButton} -mt-1 text-ink-2`}>{t('sessions.logoutAll')}</Button>}
      >
        <Rows>
          {SESSIONS.map((s) => (
            <SettingRow
              key={s.key}
              title={t(`sessions.devices.${s.key}.name`)}
              hint={t(`sessions.devices.${s.key}.meta`)}
              icon={<IconTile><Icon as={SESSION_ICONS[s.key]} size={16} strokeWidth={1.7} /></IconTile>}
            >
              {s.current ? (
                <Tag tone="green" size="sm">{t('sessions.current')}</Tag>
              ) : (
                <Button variant="ghost" size="xs" className={`${compactButton} text-ink-2`}>{t('sessions.logout')}</Button>
              )}
            </SettingRow>
          ))}
        </Rows>
      </Panel>
      <section className="flex flex-wrap items-center gap-4 rounded-card-sm bg-error-50/60 p-5 shadow-[0_0_0_1px_oklch(0.6_0.17_28/.18)]">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <span className="text-sm font-medium text-error-text">{t('danger.title')}</span>
          <span className="max-w-[460px] text-xs leading-normal text-ink-2">{t('danger.hint')}</span>
        </div>
        <Button variant="secondary" size="xs" className={`${compactButton} text-error-text shadow-[inset_0_0_0_1px_oklch(0.6_0.17_28/.35)] hover:bg-error-50 hover:text-error-text`}>{t('danger.action')}</Button>
      </section>
    </>
  );
}
