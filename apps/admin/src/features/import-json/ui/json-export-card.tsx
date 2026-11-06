import { Copy, Download } from 'lucide-react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslations } from 'use-intl';
import { Button } from '@cefr/ui/components/button';
import type { TestDraft } from '@/entities/test';
import { downloadText } from '@/shared/lib/download';
import { Panel } from '@/shared/ui';

export function JsonExportCard() {
  const t = useTranslations('json');
  const { control } = useFormContext<TestDraft>();
  const draft = useWatch({ control }) as TestDraft;
  const json = JSON.stringify(draft, null, 2);

  return (
    <Panel
      title={t('exportTitle')}
      actions={
        <>
          <Button variant="secondary" size="xs" icon={<Copy size={14} />} onClick={() => navigator.clipboard.writeText(json)}>
            {t('copy')}
          </Button>
          <Button variant="secondary" size="xs" icon={<Download size={14} />} onClick={() => downloadText(`${draft.id}.json`, json)}>
            {t('download')}
          </Button>
        </>
      }
    >
      <pre className="max-h-[480px] overflow-auto rounded-sm bg-surface-sunken p-3 font-mono text-xs text-ink">{json}</pre>
    </Panel>
  );
}
