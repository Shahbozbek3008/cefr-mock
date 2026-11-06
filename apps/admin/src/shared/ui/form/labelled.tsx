import type { ReactNode } from 'react';
import { Field } from '@cefr/ui/components/field';

type LabelledProps = {
  id: string;
  label?: string;
  hint?: ReactNode;
  className?: string;
  children: ReactNode;
};

export function Labelled({ id, label, hint, className, children }: LabelledProps) {
  if (!label) return <div className={className}>{children}</div>;
  return (
    <Field label={label} htmlFor={id} hint={hint} className={className}>
      {children}
    </Field>
  );
}
