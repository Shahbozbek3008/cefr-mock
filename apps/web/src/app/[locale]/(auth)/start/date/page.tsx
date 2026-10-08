import { useTranslations } from 'next-intl';
import { DAILY_MINUTES } from '@cefr/core';
import { LEVELS, ROUTES } from '@/lib/constants';
import { MOCK_EXAM } from '@/lib/mock/user';
import { initLocale, metadataTitle, type LocaleParams } from '@/lib/i18n';
import { ButtonLink } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tag } from '@/components/ui/tag';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { AuthTopBar, BackLink, StepIndicator } from '@/components/auth/auth-top-bar';
import { Stage } from '@/components/layout/stage';
import { ExamCalendar } from '@/components/auth/exam-calendar';
import { OnboardingSplit } from '@/components/auth/onboarding-split';

export const generateMetadata = metadataTitle('onboarding.date.title');

const target = LEVELS.find((l) => l.code === MOCK_EXAM.target)!;

function DateView() {
  const t = useTranslations('onboarding');
  return (
    <Stage topBar={<AuthTopBar start={<BackLink href={ROUTES.start} />} center={<StepIndicator current={2} />} />}>
      <OnboardingSplit
        title={t('date.title')}
        text={t('date.text')}
        aside={<ExamCalendar />}
      >
        <div className="flex flex-col gap-2.5">
          <span className="text-[13px] font-medium">{t('date.daily')}</span>
          <SegmentedControl
            size="lg"
            label={t('date.daily')}
            defaultValue="30"
            options={DAILY_MINUTES.map((m) => ({ value: String(m), label: t('date.options.minutes', { count: m }) }))}
          />
        </div>
        <Card radius="md" className="flex items-center gap-4 rounded-[14px] px-4 py-3.5">
          <div className="flex flex-1 flex-col gap-0.5">
            <span className="text-xs text-ink-2">{t('date.planLabel')}</span>
            <span className="text-[15px] font-medium">{t('date.planValue', { days: MOCK_EXAM.daysLeft, tests: MOCK_EXAM.mockTests })}</span>
          </div>
          <Tag className="h-[26px] rounded-[9px] px-2.5 font-mono font-normal">{t('date.target', { level: target.code, min: target.min })}</Tag>
        </Card>
        <ButtonLink href={ROUTES.startAccount} size="md" arrow block className="h-11 rounded-[12px]">{t('continue')}</ButtonLink>
      </OnboardingSplit>
    </Stage>
  );
}

export default async function DatePage({ params }: { params: LocaleParams }) {
  await initLocale(params);
  return <DateView />;
}
