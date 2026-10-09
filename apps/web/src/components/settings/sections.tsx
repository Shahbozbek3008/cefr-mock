'use client';

import { useRef, useState, type ReactNode } from 'react';
import { useFormatter, useTranslations } from 'next-intl';
import { useQueryClient } from '@tanstack/react-query';
import { BellRing, Check, LogOut, MonitorSmartphone, RotateCcw, Smartphone, Sparkles } from 'lucide-react';
import {
  DAILY_MINUTES,
  DEFAULT_DAILY_MINUTES,
  TARGET_LEVELS,
  daysUntil,
  formatPhone,
  removeAvatar,
  resetProgress,
  uploadAvatar,
  useCefrClient,
  useProfile,
  useUpdateProfile,
  type DailyMinutes,
  type Profile,
  type TargetLevel,
} from '@cefr/core';
import { ROUTES } from '@/lib/constants';
import { cn } from '@/lib/cn';
import { toSquareJpeg } from '@/lib/image';
import { useAttemptStore } from '@/lib/attempt-store';
import { useSignOut } from '@/lib/supabase/sign-out';
import { useWebPush } from '@/lib/firebase/web-push';
import { Tag } from '@/components/ui/tag';
import { Icon } from '@/components/ui/icon';
import { Avatar } from '@/components/ui/avatar';
import { BRAND_NAME, LogoMark } from '@/components/ui/logo';
import { Button, ButtonLink } from '@/components/ui/button';
import { Switch } from '@/components/ui/controls';
import { Field, TextInput } from '@/components/ui/field';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { Skeleton, SkeletonText } from '@/components/ui/skeleton';
import { LocaleSwitcher } from '@/components/layout/locale-switcher';
import { ExamCalendar } from '@/components/auth/exam-calendar';
import { Panel } from '@/components/dashboard/panel';

const compactButton = 'h-9 rounded-[10px] px-3.5 text-[13px]';
const controlSkeleton = 'h-9 rounded-[10px]';
const inputSkeleton = 'h-12 rounded-input';
const switchSkeleton = 'h-[26px] w-11 rounded-[13px]';
const dangerButton = 'bg-none bg-error hover:bg-error';
const iconTile = (tone: string) => `grid size-[52px] place-items-center rounded-2xl ${tone}`;

const phoneLabel = (phone: string | null) => (phone ? `+998 ${formatPhone(phone.replace(/^\+998/, ''))}` : '—');

function Rows({ children }: { children: ReactNode }) {
  return <div className="flex flex-col px-5 pt-1 pb-1">{children}</div>;
}

function SettingRow({ title, hint, icon, children }: { title: string; hint: ReactNode; icon?: ReactNode; children: ReactNode }) {
  return (
    <div className="flex min-h-16 flex-wrap items-center gap-x-4 gap-y-2 py-3 shadow-[0_1px_0_var(--divider)] last:shadow-none">
      {icon}
      <div className="flex min-w-0 flex-1 basis-[220px] flex-col gap-0.5">
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

type SaveState = 'idle' | 'saved' | 'failed';

function SaveNote({ state }: { state: SaveState }) {
  const t = useTranslations('settings');
  if (state === 'idle') return null;
  return state === 'saved' ? (
    <span className="flex animate-fade-up items-center gap-1 text-xs font-medium text-success"><Icon as={Check} size={12} strokeWidth={2.5} />{t('saved')}</span>
  ) : (
    <span className="animate-fade-up text-xs text-error-text">{t('saveFailed')}</span>
  );
}

const useSaver = () => {
  const update = useUpdateProfile();
  const [state, setState] = useState<SaveState>('idle');
  const save = async (patch: Parameters<typeof update.mutateAsync>[0]) => {
    setState('idle');
    try {
      await update.mutateAsync(patch);
      setState('saved');
      return true;
    } catch {
      setState('failed');
      return false;
    }
  };
  return { save, state, pending: update.isPending };
};

function ProfileFormSkeleton() {
  const t = useTranslations('settings.profile');
  return (
    <Panel title={t('title')} subtitle={t('subtitle')}>
      <div className="flex flex-col gap-5 p-5">
        <div className="flex flex-wrap items-center gap-4">
          <Skeleton className="size-16 rounded-full" />
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <SkeletonText className="w-40 text-[15px]" />
            <SkeletonText className="w-28 text-xs" />
          </div>
          <Skeleton className={cn(controlSkeleton, 'w-full sm:w-32')} />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label={t('firstName')} htmlFor="firstName"><Skeleton className={inputSkeleton} /></Field>
          <Field label={t('lastName')} htmlFor="lastName"><Skeleton className={inputSkeleton} /></Field>
          <Field label={t('phone')} htmlFor="phone" className="sm:col-span-2"><Skeleton className={inputSkeleton} /></Field>
        </div>
        <div className="flex items-center justify-end gap-3 pt-1">
          <Skeleton className={cn(controlSkeleton, 'w-24')} />
          <Skeleton className={cn(controlSkeleton, 'w-24')} />
        </div>
      </div>
    </Panel>
  );
}

function ProfileForm({ profile }: { profile: Profile }) {
  const t = useTranslations('settings');
  const format = useFormatter();
  const client = useCefrClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const { save, pending } = useSaver();
  const [firstName, setFirstName] = useState(profile.firstName);
  const [lastName, setLastName] = useState(profile.lastName);
  const [photoBusy, setPhotoBusy] = useState(false);
  const [photoFailed, setPhotoFailed] = useState(false);
  const dirty = firstName.trim() !== profile.firstName || lastName.trim() !== profile.lastName;
  const initial = (profile.firstName || '?').charAt(0).toUpperCase();

  const replacePhoto = async (next: () => Promise<string | null>) => {
    setPhotoBusy(true);
    setPhotoFailed(false);
    const previous = profile.avatarPath;
    try {
      const path = await next();
      if (!(await save({ avatarPath: path }))) throw new Error('save_failed');
      if (previous) await removeAvatar(client, previous).catch(() => undefined);
    } catch {
      setPhotoFailed(true);
    } finally {
      setPhotoBusy(false);
    }
  };

  const onFile = (file: File | undefined) => {
    if (fileRef.current) fileRef.current.value = '';
    if (file) replacePhoto(async () => uploadAvatar(client, await toSquareJpeg(file)));
  };

  return (
    <Panel title={t('profile.title')} subtitle={t('profile.subtitle')}>
      <div className="flex flex-col gap-5 p-5">
        <div className="flex flex-wrap items-center gap-4">
          <span className={cn('rounded-full transition-opacity', photoBusy && 'animate-pulse opacity-60')}>
            <Avatar initial={initial} size={64} src={profile.avatarUrl} />
          </span>
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <span className="text-[15px] font-medium">{[profile.firstName, profile.lastName].filter(Boolean).join(' ') || phoneLabel(profile.phone)}</span>
            <span className={cn('text-xs', photoFailed ? 'text-error-text' : 'text-ink-3')}>
              {photoFailed ? t('profile.photoFailed') : t('profile.since', { date: format.dateTime(new Date(profile.createdAt), { month: 'long', year: 'numeric' }) })}
            </span>
          </div>
          <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
          <div className="flex w-full gap-2 sm:w-auto">
            {profile.avatarPath && (
              <Button variant="ghost" size="xs" disabled={photoBusy} className={`${compactButton} text-ink-2 max-sm:flex-1`} onClick={() => replacePhoto(async () => null)}>
                {t('profile.removePhoto')}
              </Button>
            )}
            <Button variant="secondary" size="xs" loading={photoBusy} className={`${compactButton} max-sm:flex-1`} onClick={() => fileRef.current?.click()}>
              {t('profile.changePhoto')}
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label={t('profile.firstName')} htmlFor="firstName">
            <TextInput size="md" id="firstName" autoComplete="given-name" maxLength={40} value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          </Field>
          <Field label={t('profile.lastName')} htmlFor="lastName">
            <TextInput size="md" id="lastName" autoComplete="family-name" maxLength={40} value={lastName} onChange={(e) => setLastName(e.target.value)} />
          </Field>
          <Field label={t('profile.phone')} htmlFor="phone" className="sm:col-span-2">
            <TextInput
              size="md"
              readOnly
              id="phone"
              value={phoneLabel(profile.phone)}
              className="font-mono"
              suffix={profile.phone && <Tag tone="success"><Icon as={Check} size={11} strokeWidth={2.5} />{t('profile.verified')}</Tag>}
            />
          </Field>
        </div>
        <div className="flex items-center justify-end gap-3 pt-1">
          <Button variant="secondary" size="xs" disabled={!dirty || pending} className={compactButton} onClick={() => { setFirstName(profile.firstName); setLastName(profile.lastName); }}>
            {t('cancel')}
          </Button>
          <Button size="xs" disabled={!dirty || !firstName.trim()} className={compactButton} onClick={() => save({ firstName, lastName })}>
            {t('save')}
          </Button>
        </div>
      </div>
    </Panel>
  );
}

function InterfacePanel() {
  const t = useTranslations('settings');
  return (
    <Panel title={t('interface.title')} subtitle={t('interface.subtitle')}>
      <Rows>
        <SettingRow title={t('preferences.language')} hint={t('preferences.languageHint')}>
          <LocaleSwitcher className="h-9 rounded-[10px] px-3 shadow-inset" />
        </SettingRow>
      </Rows>
    </Panel>
  );
}

export function ProfileSection() {
  const profile = useProfile().data;
  return (
    <>
      {profile ? <ProfileForm key={profile.id} profile={profile} /> : <ProfileFormSkeleton />}
      <InterfacePanel />
    </>
  );
}

function ExamDateDialog({ open, value, onClose, onPick }: { open: boolean; value: string | null; onClose: () => void; onPick: (iso: string | null) => void }) {
  const t = useTranslations('settings.exam');
  const tc = useTranslations('exam.common');
  const [draft, setDraft] = useState(value);

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent title={t('pickTitle')} description={t('pickText')} closeLabel={tc('close')}>
        <ExamCalendar value={draft} onChange={setDraft} className="p-4 shadow-[0_0_0_1px_rgba(20,22,30,.06)]" />
        <div className="grid grid-cols-2 gap-2.5">
          <Button variant="secondary" onClick={() => onPick(null)}>{t('clearDate')}</Button>
          <Button disabled={!draft} onClick={() => onPick(draft)}>{t('confirm')}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ExamSectionSkeleton() {
  const t = useTranslations('settings');
  return (
    <Panel title={t('exam.title')} subtitle={t('exam.subtitle')}>
      <Rows>
        <SettingRow title={t('preferences.target')} hint={t('preferences.targetHint')}>
          <Skeleton className={cn(controlSkeleton, 'w-[168px]')} />
        </SettingRow>
        <SettingRow title={t('preferences.examDate')} hint={<SkeletonText className="w-28" />}>
          <Skeleton className={cn(controlSkeleton, 'w-36')} />
        </SettingRow>
        <SettingRow title={t('exam.daily')} hint={t('exam.dailyHint')}>
          <Skeleton className={cn(controlSkeleton, 'w-full sm:w-[280px]')} />
        </SettingRow>
      </Rows>
    </Panel>
  );
}

export function ExamSection() {
  const t = useTranslations('settings');
  const td = useTranslations('onboarding.date.options');
  const format = useFormatter();
  const profile = useProfile().data;
  const { save, state } = useSaver();
  const [dateOpen, setDateOpen] = useState(false);
  if (!profile) return <ExamSectionSkeleton />;

  const examDate = profile.examDate;
  const pickDate = (iso: string | null) => {
    setDateOpen(false);
    if (iso !== examDate) save({ examDate: iso });
  };

  return (
    <Panel title={t('exam.title')} subtitle={t('exam.subtitle')} action={<SaveNote state={state} />}>
      <Rows>
        <SettingRow title={t('preferences.target')} hint={t('preferences.targetHint')}>
          <SegmentedControl
            label={t('preferences.target')}
            value={profile.targetLevel ?? ''}
            onValueChange={(value) => save({ targetLevel: value as TargetLevel })}
            className="h-9 w-[168px] rounded-[10px] text-xs [&>button]:rounded-[7px]"
            options={TARGET_LEVELS.map((level) => ({ value: level, label: level }))}
          />
        </SettingRow>
        <SettingRow title={t('preferences.examDate')} hint={examDate ? t('preferences.daysLeft', { days: daysUntil(examDate) }) : t('exam.noDate')}>
          <Button variant="secondary" size="xs" className={compactButton} onClick={() => setDateOpen(true)}>
            {examDate ? format.dateTime(new Date(`${examDate}T00:00:00`), { day: 'numeric', month: 'long', year: 'numeric' }) : t('exam.pickTitle')}
          </Button>
        </SettingRow>
        <SettingRow title={t('exam.daily')} hint={t('exam.dailyHint')}>
          <SegmentedControl
            label={t('exam.daily')}
            value={String(profile.dailyMinutes ?? DEFAULT_DAILY_MINUTES)}
            onValueChange={(value) => save({ dailyMinutes: Number(value) as DailyMinutes })}
            className="h-9 w-full rounded-[10px] text-xs sm:w-[280px] [&>button]:rounded-[7px] [&>button]:px-2"
            options={DAILY_MINUTES.map((m) => ({ value: String(m), label: td('minutes', { count: m }) }))}
          />
        </SettingRow>
      </Rows>
      {dateOpen && <ExamDateDialog open value={examDate} onClose={() => setDateOpen(false)} onPick={pickDate} />}
    </Panel>
  );
}

const ALWAYS_ON = ['results', 'newTests'] as const;

function AlwaysOnRows() {
  const t = useTranslations('settings.notifications');
  return ALWAYS_ON.map((key) => (
    <SettingRow key={key} title={t(`items.${key}.title`)} hint={t(`items.${key}.hint`)} icon={<IconTile><Icon as={Sparkles} size={16} strokeWidth={1.7} /></IconTile>}>
      <Tag tone="neutral" size="sm">{t('alwaysOn')}</Tag>
    </SettingRow>
  ));
}

function NotificationsSectionSkeleton() {
  const t = useTranslations('settings.notifications');
  return (
    <Panel title={t('title')} subtitle={t('subtitle')}>
      <Rows>
        <SettingRow title={t('items.reminder.title')} hint={t('items.reminder.hint')} icon={<IconTile><Icon as={MonitorSmartphone} size={16} strokeWidth={1.7} /></IconTile>}>
          <Skeleton className={switchSkeleton} />
        </SettingRow>
        <SettingRow title={t('browser.title')} hint={<SkeletonText className="w-48" />} icon={<IconTile><Icon as={BellRing} size={16} strokeWidth={1.7} /></IconTile>}>
          <Skeleton className={switchSkeleton} />
        </SettingRow>
        <AlwaysOnRows />
      </Rows>
    </Panel>
  );
}

export function NotificationsSection() {
  const t = useTranslations('settings.notifications');
  const client = useCefrClient();
  const profile = useProfile().data;
  const { save, state } = useSaver();
  const browser = useWebPush(client);
  const [browserBusy, setBrowserBusy] = useState(false);
  if (!profile) return <NotificationsSectionSkeleton />;

  const toggleBrowser = async (checked: boolean) => {
    setBrowserBusy(true);
    await (checked ? browser.enable() : browser.disable());
    setBrowserBusy(false);
  };

  const browserHint =
    browser.status === 'unavailable' ? t('browser.unavailable') : browser.status === 'denied' ? t('browser.denied') : !profile.reminderEnabled ? t('browser.pushOff') : t('browser.hint');

  return (
    <Panel title={t('title')} subtitle={t('subtitle')} action={<SaveNote state={state} />}>
      <Rows>
        <SettingRow title={t('items.reminder.title')} hint={t('items.reminder.hint')} icon={<IconTile><Icon as={MonitorSmartphone} size={16} strokeWidth={1.7} /></IconTile>}>
          <Switch label={t('items.reminder.title')} checked={profile.reminderEnabled} onCheckedChange={(checked) => save({ reminderEnabled: checked })} />
        </SettingRow>
        <SettingRow title={t('browser.title')} hint={browserHint} icon={<IconTile><Icon as={BellRing} size={16} strokeWidth={1.7} /></IconTile>}>
          <Switch
            label={t('browser.title')}
            checked={browser.status === 'on'}
            disabled={browserBusy || !profile.reminderEnabled || browser.status === 'checking' || browser.status === 'unavailable' || browser.status === 'denied'}
            onCheckedChange={toggleBrowser}
          />
        </SettingRow>
        <AlwaysOnRows />
      </Rows>
    </Panel>
  );
}

function PlanBadge() {
  return (
    <span className="grid size-11 shrink-0 place-items-center rounded-[12px] bg-surface shadow-[0_0_0_1px_var(--border),0_4px_10px_-6px_rgba(20,22,30,.2)]">
      <LogoMark size="md" />
    </span>
  );
}

function SubscriptionSectionSkeleton() {
  return (
    <Panel>
      <div className="flex flex-wrap items-center gap-4 p-5">
        <PlanBadge />
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <SkeletonText className="w-40 text-[15px]" />
          <SkeletonText className="w-56 text-xs" />
        </div>
        <Skeleton className={cn(controlSkeleton, 'w-28')} />
      </div>
    </Panel>
  );
}

export function SubscriptionSection() {
  const t = useTranslations('settings.subscription');
  const profile = useProfile().data;
  if (!profile) return <SubscriptionSectionSkeleton />;

  return (
    <Panel>
      <div className="flex flex-wrap items-center gap-4 p-5">
        <PlanBadge />
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="flex items-center gap-2 text-[15px] font-medium">
            {profile.isPro ? `${BRAND_NAME} Pro` : t('free')}
            <Tag tone={profile.isPro ? 'pro' : 'success'} size="sm">{t('active')}</Tag>
          </span>
          <span className="text-xs text-ink-3">{t(profile.isPro ? 'proHint' : 'freeHint')}</span>
        </div>
        {profile.isPro ? (
          <ButtonLink href={ROUTES.billing} variant="secondary" size="xs" className={compactButton}>{t('change')}</ButtonLink>
        ) : (
          <ButtonLink href={ROUTES.billing} size="xs" arrow className={compactButton}>{t('upgrade')}</ButtonLink>
        )}
      </div>
    </Panel>
  );
}

type Confirm = 'signOut' | 'reset' | null;

export function SecuritySection() {
  const t = useTranslations('settings.security');
  const tp = useTranslations('settings.profile');
  const tc = useTranslations('exam.common');
  const client = useCefrClient();
  const queryClient = useQueryClient();
  const signOut = useSignOut();
  const profile = useProfile().data;
  const [confirm, setConfirm] = useState<Confirm>(null);
  const [busy, setBusy] = useState(false);
  const [resetNote, setResetNote] = useState<'done' | 'failed' | null>(null);

  const leave = async (scope: 'local' | 'global') => {
    setBusy(true);
    await signOut(scope);
  };

  const reset = async () => {
    setBusy(true);
    setResetNote(null);
    try {
      await resetProgress(client);
      useAttemptStore.getState().reset();
      await queryClient.resetQueries();
      setResetNote('done');
      setConfirm(null);
    } catch {
      setResetNote('failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Panel>
        <Rows>
          <SettingRow title={t('phone.title')} hint={t('phone.hint')} icon={<IconTile><Icon as={Smartphone} size={16} strokeWidth={1.7} /></IconTile>}>
            {profile ? (
              <span className="flex items-center gap-2">
                <span className="font-mono text-xs">{phoneLabel(profile.phone)}</span>
                {profile.phone && <Tag tone="success" size="sm"><Icon as={Check} size={10} strokeWidth={2.5} />{tp('verified')}</Tag>}
              </span>
            ) : (
              <SkeletonText className="w-36 text-xs" />
            )}
          </SettingRow>
          <SettingRow title={t('signOut.title')} hint={t('signOut.hint')} icon={<IconTile><Icon as={LogOut} size={16} strokeWidth={1.7} /></IconTile>}>
            <Button variant="secondary" size="xs" disabled={busy} className={compactButton} onClick={() => setConfirm('signOut')}>{t('signOut.action')}</Button>
          </SettingRow>
          <SettingRow title={t('signOutAll.title')} hint={t('signOutAll.hint')} icon={<IconTile><Icon as={MonitorSmartphone} size={16} strokeWidth={1.7} /></IconTile>}>
            <Button variant="ghost" size="xs" disabled={busy && confirm !== null} className={`${compactButton} text-ink-2`} onClick={() => leave('global')}>{t('signOutAll.action')}</Button>
          </SettingRow>
        </Rows>
      </Panel>
      <section className="flex flex-wrap items-center gap-4 rounded-card-sm bg-error-50/60 p-5 shadow-[0_0_0_1px_oklch(0.6_0.17_28/.18)]">
        <div className="flex min-w-0 flex-1 basis-[260px] flex-col gap-1">
          <span className="text-sm font-medium text-error-text">{t('reset.title')}</span>
          <span className="max-w-[460px] text-xs leading-normal text-ink-2">{t('reset.hint')}</span>
          {resetNote === 'done' && <span className="flex animate-fade-up items-center gap-1 pt-1 text-xs font-medium text-success"><Icon as={Check} size={12} strokeWidth={2.5} />{t('reset.done')}</span>}
        </div>
        <Button
          variant="secondary"
          size="xs"
          disabled={busy}
          className={`${compactButton} text-error-text shadow-[inset_0_0_0_1px_oklch(0.6_0.17_28/.35)] hover:bg-error-50 hover:text-error-text`}
          onClick={() => { setResetNote(null); setConfirm('reset'); }}
        >
          {t('reset.action')}
        </Button>
      </section>

      <Dialog open={confirm !== null} onOpenChange={(open) => !open && !busy && setConfirm(null)}>
        {confirm && (
          <DialogContent
            title={t(`${confirm}.confirmTitle`)}
            description={t(`${confirm}.hint`)}
            closeLabel={tc('close')}
            icon={<span className={iconTile('bg-error-50 text-error-text')}><Icon as={confirm === 'reset' ? RotateCcw : LogOut} size={22} /></span>}
          >
            {resetNote === 'failed' && confirm === 'reset' && <span className="text-[13px] text-error-text">{t('reset.failed')}</span>}
            <div className="grid grid-cols-2 gap-2.5">
              <Button variant="secondary" disabled={busy} onClick={() => setConfirm(null)}>{tc('cancel')}</Button>
              <Button loading={busy} className={dangerButton} onClick={() => (confirm === 'reset' ? reset() : leave('local'))}>
                {t(`${confirm}.action`)}
              </Button>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
}
