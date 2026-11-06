import { useTranslations } from 'use-intl';
import { Tag } from '@cefr/ui/components/tag';

type TestStatusBadgesProps = {
  published: boolean;
  isPro?: boolean;
  isNew?: boolean;
};

export function TestStatusBadges({ published, isPro, isNew }: TestStatusBadgesProps) {
  const t = useTranslations('testStatus');
  return (
    <div className="flex flex-wrap gap-1.5">
      <Tag tone={published ? 'green' : 'warning'}>{published ? t('published') : t('draft')}</Tag>
      {isPro !== undefined && <Tag tone={isPro ? 'blue' : 'sunken'}>{isPro ? t('pro') : t('free')}</Tag>}
      {isNew && <Tag tone="neutral">{t('new')}</Tag>}
    </div>
  );
}
