import type { ReactNode } from 'react';
import { buttonVariants } from '@cefr/ui/components/button-variants';
import { cn } from '@cefr/ui/lib/cn';

type FileButtonProps = {
  accept: string;
  icon?: ReactNode;
  disabled?: boolean;
  onSelect: (file: File) => void;
  children: ReactNode;
};

export function FileButton({ accept, icon, disabled, onSelect, children }: FileButtonProps) {
  return (
    <label className={cn(buttonVariants({ variant: 'secondary', size: 'xs' }), 'cursor-pointer', disabled && 'pointer-events-none opacity-50')}>
      <input
        type="file"
        accept={accept}
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          event.target.value = '';
          if (file) onSelect(file);
        }}
      />
      {icon}
      {children}
    </label>
  );
}
