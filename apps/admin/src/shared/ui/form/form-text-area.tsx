import { useId } from 'react';
import { Controller, type FieldValues } from 'react-hook-form';
import { cn } from '@cefr/ui/lib/cn';
import { TextArea } from '../text-area';
import { Labelled } from './labelled';
import type { FormFieldProps } from './types';

type FormTextAreaProps<T extends FieldValues> = FormFieldProps<T> & {
  rows?: number;
  placeholder?: string;
  mono?: boolean;
};

export function FormTextArea<T extends FieldValues>({ control, name, label, ariaLabel, hint, className, rows, placeholder, mono }: FormTextAreaProps<T>) {
  const id = useId();
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <Labelled id={id} label={label} hint={hint} className={className}>
          <TextArea
            id={id}
            ref={field.ref}
            name={field.name}
            rows={rows}
            placeholder={placeholder}
            aria-label={label ? undefined : ariaLabel}
            className={cn(mono && 'font-mono text-xs')}
            value={field.value ?? ''}
            onBlur={field.onBlur}
            onChange={(event) => field.onChange(event.target.value)}
          />
        </Labelled>
      )}
    />
  );
}
