import { useId, type HTMLAttributes } from 'react';
import { Controller, type FieldValues } from 'react-hook-form';
import { TextInput } from '@cefr/ui/components/field';
import { Labelled } from './labelled';
import type { FormFieldProps } from './types';

type FormTextFieldProps<T extends FieldValues> = FormFieldProps<T> & {
  placeholder?: string;
  readOnly?: boolean;
  autoFocus?: boolean;
  inputMode?: HTMLAttributes<HTMLInputElement>['inputMode'];
  transform?: (value: string) => string;
};

export function FormTextField<T extends FieldValues>({ control, name, label, ariaLabel, hint, className, placeholder, readOnly, autoFocus, inputMode, transform }: FormTextFieldProps<T>) {
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
            ref={field.ref}
            name={field.name}
            value={field.value ?? ''}
            readOnly={readOnly}
            autoFocus={autoFocus}
            inputMode={inputMode}
            placeholder={placeholder}
            aria-label={label ? undefined : ariaLabel}
            onBlur={field.onBlur}
            onChange={(event) => field.onChange(transform ? transform(event.target.value) : event.target.value)}
          />
        </Labelled>
      )}
    />
  );
}
