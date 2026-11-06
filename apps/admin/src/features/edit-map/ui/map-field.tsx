import { useId, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { useTranslations } from 'use-intl';
import type { MapSpec } from '@cefr/core';
import { Field } from '@cefr/ui/components/field';
import type { TestDraft } from '@/entities/test';
import { TextArea } from '@/shared/ui';

type MapError = 'invalidJson' | 'invalidShape';

type ParseResult = { map: MapSpec | undefined } | { error: MapError };

const parseMap = (text: string): ParseResult => {
  if (!text.trim()) return { map: undefined };
  try {
    const value = JSON.parse(text) as MapSpec;
    return Array.isArray(value.roads) && Array.isArray(value.blocks) ? { map: value } : { error: 'invalidShape' };
  } catch {
    return { error: 'invalidJson' };
  }
};

const toText = (map: MapSpec | undefined) => (map ? JSON.stringify(map, null, 2) : '');

function MapInput({ id, value, onChange }: { id: string; value: MapSpec | undefined; onChange: (map: MapSpec | undefined) => void }) {
  const t = useTranslations('mapField');
  const [text, setText] = useState(() => toText(value));
  const [error, setError] = useState<MapError | null>(null);

  const commit = () => {
    const result = parseMap(text);
    if ('error' in result) return setError(result.error);
    setError(null);
    onChange(result.map);
  };

  return (
    <>
      <TextArea id={id} rows={5} className="font-mono text-xs" value={text} onChange={(event) => setText(event.target.value)} onBlur={commit} />
      {error && <span className="text-xs text-error-text">{t(error)}</span>}
    </>
  );
}

export function MapField({ partIndex }: { partIndex: number }) {
  const t = useTranslations('mapField');
  const id = useId();
  const { control } = useFormContext<TestDraft>();

  return (
    <Field label={t('label')} htmlFor={id} hint={t('hint')}>
      <Controller control={control} name={`listening.${partIndex}.map`} render={({ field }) => <MapInput id={id} value={field.value} onChange={field.onChange} />} />
    </Field>
  );
}
