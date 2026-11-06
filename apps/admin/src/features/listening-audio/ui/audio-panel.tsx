import { Sparkles, Upload } from 'lucide-react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslations } from 'use-intl';
import { Button } from '@cefr/ui/components/button';
import { Tag } from '@cefr/ui/components/tag';
import type { TestDraft } from '@/entities/test';
import { formatDuration } from '@/shared/lib/format-duration';
import { ErrorNotice, FileButton, Notice } from '@/shared/ui';
import { listeningAudioUrl } from '../api/audio-api';
import { useAudioActions, type AudioStatus } from '../model/use-audio-actions';
import { AudioCuesField } from './audio-cues-field';

function StatusText({ status }: { status: AudioStatus }) {
  const t = useTranslations('audio.status');
  if (status.step === 'idle') return null;
  const text = status.step === 'synthesizing' ? t('synthesizing', { done: status.done, total: status.total }) : t(status.step);
  return <span className="self-center text-xs text-ink-2">{text}</span>;
}

export function AudioPanel({ partIndex }: { partIndex: number }) {
  const t = useTranslations('audio');
  const { control } = useFormContext<TestDraft>();
  const [audio, durationSec] = useWatch({ control, name: [`listening.${partIndex}.audio`, `listening.${partIndex}.durationSec`] });
  const { status, error, busy, upload, generate } = useAudioActions(partIndex);

  return (
    <div className="flex flex-col gap-3">
      {audio ? (
        <div className="flex flex-col gap-2">
          <audio controls preload="none" src={listeningAudioUrl(audio)} className="w-full" />
          <div className="flex flex-wrap items-center gap-2 text-xs text-ink-3">
            <Tag tone="green">{t('present')}</Tag>
            <span>{audio}</span>
            <span>· {formatDuration(durationSec)}</span>
          </div>
        </div>
      ) : (
        <Notice tone="warning">{t('missing')}</Notice>
      )}

      <div className="flex flex-wrap gap-2">
        <FileButton accept="audio/mpeg,.mp3" icon={<Upload size={14} />} disabled={busy} onSelect={upload}>
          {t('upload')}
        </FileButton>
        <Button variant="secondary" size="xs" icon={<Sparkles size={14} />} loading={busy} onClick={generate}>
          {t('generate')}
        </Button>
        <StatusText status={status} />
      </div>
      <ErrorNotice error={error} />
      <AudioCuesField partIndex={partIndex} />
    </div>
  );
}
