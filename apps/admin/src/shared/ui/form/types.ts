import type { ReactNode } from 'react';
import type { Control, FieldValues, Path } from 'react-hook-form';

export type FormFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  ariaLabel?: string;
  hint?: ReactNode;
  className?: string;
};
