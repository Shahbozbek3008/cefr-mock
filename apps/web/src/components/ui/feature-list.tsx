import { Check } from 'lucide-react';
import { cn } from '@/lib/cn';
import { Icon } from './icon';

type FeatureListProps = { items: readonly string[]; variant?: 'plain' | 'badge'; className?: string };

export function FeatureList({ items, variant = 'plain', className }: FeatureListProps) {
  return (
    <ul className={cn('m-0 flex list-none flex-col gap-3 p-0', className)}>
      {items.map((item) => (
        <li key={item} className="flex items-center gap-2.5 text-sm text-ink-body">
          {variant === 'plain' ? (
            <Icon as={Check} size={16} strokeWidth={2} className="shrink-0 text-[oklch(0.5_0.14_140)] max-md:size-[15px]" />
          ) : (
            <span className="grid size-5 shrink-0 place-items-center rounded-full bg-green-100 text-green-text">
              <Icon as={Check} size={11} strokeWidth={2.8} />
            </span>
          )}
          {item}
        </li>
      ))}
    </ul>
  );
}
