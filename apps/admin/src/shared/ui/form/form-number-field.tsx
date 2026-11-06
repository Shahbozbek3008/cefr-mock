import { useId } from 'react';
import { Controller, type FieldValues } from 'react-hook-form';
import { TextInput } from '@cefr/ui/components/field';
import { Labelled } from './labelled';
import type { FormFieldProps } from './types';

type FormNumberFieldProps<T extends FieldValues> = FormFieldProps<T> & {
  optional?: boolean;
  min?: number;
  step?: number;
  placeholder?: string;
  onValueChange?: (value: number | undefined, previous: unknown) => void;
};

const toDisplay = (value: unknown) => (typeof value === 'number' && Number.isFinite(value) ? String(value) : '');

const toValue = (raw: string, optional: boolean) => {
  if (raw === '') return optional ? undefined : Number.NaN;
  return Number(raw);
};

export function FormNumberField<T extends FieldValues>({
  control,
  name,
  label,
  ariaLabel,
  hint,
  className,
  optional = false,
  min,
  step,
  placeholder,
  onValueChange,
}: FormNumberFieldProps<T>) {
  const id = useId();
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <Labelled id={id} label={label} hint={hint} className={className}>
          <TextInput
            id={id}
            size="md"
            type="number"
            ref={field.ref}
            name={field.name}
            min={min}
            step={step}
            placeholder={placeholder}
            aria-label={label ? undefined : ariaLabel}
            value={toDisplay(field.value)}
            onBlur={field.onBlur}
            onChange={(event) => {
              const next = toValue(event.target.value, optional);
              const previous = field.value;
              field.onChange(next);
              onValueChange?.(next, previous);
            }}
          />
        </Labelled>
      )}
    />
  );
}
