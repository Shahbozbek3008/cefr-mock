import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import type { AudioCues, TestDraft } from '@/entities/test';
import { AppError } from '@/shared/api/app-error';
import { isMp3, synthesizeLine, uploadListeningAudio } from '../api/audio-api';
import { mp3Duration } from '../lib/mp3-duration';
import { renderScript } from '../lib/render-script';

export type AudioStatus = { step: 'idle' } | { step: 'measuring' } | { step: 'uploading' } | { step: 'synthesizing'; done: number; total: number };

export const useAudioActions = (partIndex: number) => {
  const { getValues, setValue } = useFormContext<TestDraft>();
  const [status, setStatus] = useState<AudioStatus>({ step: 'idle' });
  const [error, setError] = useState<unknown>(null);
  const base = `listening.${partIndex}` as const;

  const apply = (audio: string, durationSec: number, audioAt?: AudioCues) => {
    const options = { shouldDirty: true };
    setValue(`${base}.audio`, audio, options);
    setValue(`${base}.durationSec`, durationSec, options);
    if (audioAt) setValue(`${base}.audioAt`, audioAt, options);
  };

  const run = async (task: () => Promise<void>) => {
    setError(null);
    try {
      await task();
      return true;
    } catch (failure) {
      setError(failure);
      return false;
    } finally {
      setStatus({ step: 'idle' });
    }
  };

  const upload = (file: File) =>
    run(async () => {
      if (!isMp3(file)) throw new AppError('onlyMp3');
      setStatus({ step: 'measuring' });
      const durationSec = await mp3Duration(file);
      setStatus({ step: 'uploading' });
      apply(await uploadListeningAudio(getValues('id'), getValues(`${base}.id`), file), durationSec);
    });

  const generate = () =>
    run(async () => {
      const script = getValues(`${base}.script`);
      if (!script.some((line) => line.text.trim())) throw new AppError('needsScript');
      const rendered = await renderScript(script, synthesizeLine, (done, total) => setStatus({ step: 'synthesizing', done, total }));
      setStatus({ step: 'uploading' });
      apply(await uploadListeningAudio(getValues('id'), getValues(`${base}.id`), rendered.blob), rendered.durationSec, rendered.audioAt);
    });

  return { status, error, busy: status.step !== 'idle', upload, generate };
};
