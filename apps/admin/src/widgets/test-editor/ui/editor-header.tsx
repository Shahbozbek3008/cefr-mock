import { ArrowLeft, Eye, EyeOff, Save } from 'lucide-react';
import { Link } from 'react-router';
import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslations } from 'use-intl';
import { Button } from '@cefr/ui/components/button';
import { Tag } from '@cefr/ui/components/tag';
import { TestStatusBadges, type TestDraft } from '@/entities/test';

type EditorHeaderProps = {
  published: boolean;
  dirty: boolean;
  isNew: boolean;
  onSave: () => Promise<boolean>;
  onTogglePublish: () => Promise<boolean> | undefined;
};

export function EditorHeader({ published, dirty, isNew, onSave, onTogglePublish }: EditorHeaderProps) {
  const t = useTranslations('editor');
  const { control } = useFormContext<TestDraft>();
  const title = useWatch({ control, name: 'title' });

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Link to="/" className="inline-flex items-center gap-1 text-sm text-ink-2 hover:text-ink">
        <ArrowLeft size={16} /> {t('back')}
      </Link>
      <h1 className="m-0 min-w-0 truncate text-lg font-medium tracking-[-0.02em] text-ink">{title || t('newTest')}</h1>
      <TestStatusBadges published={published} />
      {dirty && <Tag tone="sunken">{t('unsaved')}</Tag>}
      <div className="ml-auto flex gap-2">
        <Button variant="secondary" size="sm" icon={published ? <EyeOff size={16} /> : <Eye size={16} />} onClick={onTogglePublish}>
          {published ? t('hide') : t('publish')}
        </Button>
        <Button size="sm" icon={<Save size={16} />} disabled={!dirty && !isNew} onClick={onSave}>
          {t('save')}
        </Button>
      </div>
    </div>
  );
}
