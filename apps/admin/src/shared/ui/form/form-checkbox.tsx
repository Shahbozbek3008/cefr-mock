import { useId } from 'react';
import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';
import { Checkbox } from '@cefr/ui/components/controls';

type FormCheckboxProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: string;
};

export function FormCheckbox<T extends FieldValues>({ control, name, label }: FormCheckboxProps<T>) {
  const id = useId();
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <Checkbox id={id} checked={Boolean(field.value)} onCheckedChange={field.onChange}>
          {label}
        </Checkbox>
      )}
    />
  );
}
