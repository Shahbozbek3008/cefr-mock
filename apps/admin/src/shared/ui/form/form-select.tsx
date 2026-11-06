import { useId } from 'react';
import { Controller, type FieldValues } from 'react-hook-form';
import { SelectInput, type SelectOption } from '../select-input';
import { Labelled } from './labelled';
import type { FormFieldProps } from './types';

type FormSelectProps<T extends FieldValues> = FormFieldProps<T> & {
  options: readonly SelectOption[];
  placeholder?: string;
  parse?: (value: string) => unknown;
  onValueChange?: (value: unknown, previous: unknown) => void;
};

export function FormSelect<T extends FieldValues>({ control, name, label, ariaLabel, hint, className, options, placeholder, parse, onValueChange }: FormSelectProps<T>) {
  const id = useId();
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <Labelled id={id} label={label} hint={hint} className={className}>
          <SelectInput
            id={id}
            ref={field.ref}
            name={field.name}
            options={options}
            placeholder={placeholder}
            aria-label={label ? undefined : ariaLabel}
            value={field.value === undefined || field.value === null ? '' : String(field.value)}
            onBlur={field.onBlur}
            onChange={(event) => {
              const next = parse ? parse(event.target.value) : event.target.value;
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
