import { useTranslations } from 'next-intl';
import { LEVELS } from '@/lib/constants';
import { MOCK_EXAM } from '@/lib/mock/user';
import { AiTip } from '@/components/ui/ai-tip';
import { KeyValueList } from '@/components/ui/key-value-list';

const target = LEVELS.find((l) => l.code === MOCK_EXAM.target)!;

export function PlanSummary() {
  const t = useTranslations('onboarding.account.summary');
  const tc = useTranslations('common');
  return (
    <div className="flex flex-col gap-[18px] rounded-card bg-surface p-6 shadow-[0_0_0_1px_rgba(20,22,30,.06),0_30px_60px_-30px_rgba(20,22,30,.18)]">
      <span className="text-[13px] text-ink-2">{t('title')}</span>
      <KeyValueList
        items={[
          { label: t('goal'), value: t('goalValue', { level: target.code, min: target.min }) },
          { label: t('exam'), value: t('examValue', { date: tc('examDate'), days: MOCK_EXAM.daysLeft }) },
          { label: t('daily'), value: t('dailyValue', { minutes: MOCK_EXAM.dailyMinutes }) },
          { label: t('plan'), value: t('planValue', { tests: MOCK_EXAM.mockTests, drills: MOCK_EXAM.drills }) },
        ]}
      />
      <AiTip>{t('tip')}</AiTip>
    </div>
  );
}
