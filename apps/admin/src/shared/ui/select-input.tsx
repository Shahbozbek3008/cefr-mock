import type { ComponentProps } from 'react';
import { ChevronDown } from 'lucide-react';
import { inputShell } from '@cefr/ui/components/field';
import { cn } from '@cefr/ui/lib/cn';

export type SelectOption = { value: string; label: string };

type SelectInputProps = Omit<ComponentProps<'select'>, 'size' | 'children'> & { options: readonly SelectOption[]; placeholder?: string };

export function SelectInput({ options, placeholder, className, ...rest }: SelectInputProps) {
  return (
    <div className={cn(inputShell({ size: 'md' }), 'relative pr-9', className)}>
      <select className="min-w-0 flex-1 appearance-none bg-transparent outline-none" {...rest}>
        {placeholder !== undefined && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown size={16} className="pointer-events-none absolute right-3 text-ink-3" />
    </div>
  );
}
