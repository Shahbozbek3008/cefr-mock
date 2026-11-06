import { useState } from 'react';
import { Download, FileUp } from 'lucide-react';
import { useTranslations } from 'use-intl';
import { Button } from '@cefr/ui/components/button';
import { createDraft, parseDraft, type DraftParseError, type TestDraft } from '@/entities/test';
import { downloadText } from '@/shared/lib/download';
import { FileButton, Panel, TextArea } from '@/shared/ui';

type JsonImportCardProps = {
  templateNumber: number;
  onImport: (draft: TestDraft) => void;
};

export function JsonImportCard({ templateNumber, onImport }: JsonImportCardProps) {
  const t = useTranslations('json');
  const [text, setText] = useState('');
  const [error, setError] = useState<DraftParseError | null>(null);

  const importSource = (source: string) => {
    const result = parseDraft(source);
    if ('error' in result) return setError(result.error);
    if (!window.confirm(t('confirmReplace'))) return;
    setError(null);
    setText('');
    onImport(result.draft);
  };

  const downloadTemplate = () => downloadText('test-template.json', JSON.stringify(createDraft(templateNumber), null, 2));

  return (
    <Panel title={t('importTitle')}>
      <p className="mb-3 text-sm text-ink-2">{t('importText')}</p>
      <div className="mb-3 flex flex-wrap gap-2">
        <FileButton accept="application/json,.json" icon={<FileUp size={14} />} onSelect={async (file) => importSource(await file.text())}>
          {t('chooseFile')}
        </FileButton>
        <Button variant="secondary" size="xs" icon={<Download size={14} />} onClick={downloadTemplate}>
          {t('template')}
        </Button>
      </div>
      <TextArea rows={6} className="font-mono text-xs" aria-label={t('pastePlaceholder')} placeholder={t('pastePlaceholder')} value={text} onChange={(event) => setText(event.target.value)} />
      <div className="mt-2 flex flex-wrap items-center gap-3">
        <Button size="xs" disabled={!text.trim()} onClick={() => importSource(text)}>
          {t('importFromText')}
        </Button>
        {error && <span className="text-sm text-error-text">{t(`errors.${error.code}`, { key: error.key ?? '' })}</span>}
      </div>
    </Panel>
  );
}
