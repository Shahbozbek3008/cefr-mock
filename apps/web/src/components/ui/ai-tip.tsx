import type { ReactNode } from 'react';
import { Sparkle } from 'lucide-react';
import { cn } from '@/lib/cn';
import { Icon } from './icon';

export function AiTip({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('flex gap-2.5 rounded-[14px] bg-blue-50 px-[14px] py-3 text-[13px] leading-normal text-blue-text', className)}>
      <Icon as={Sparkle} size={15} className="mt-0.5 shrink-0" />
      <span>{children}</span>
    </div>
  );
}

export function AiLabel({ children }: { children: ReactNode }) {
  return (
    <span className="flex items-center gap-2 text-[13px] font-medium text-blue-text">
      <Icon as={Sparkle} size={15} />
      {children}
    </span>
  );
}
