import { ArrowDown, ArrowUp, Trash2 } from 'lucide-react';
import { useTranslations } from 'use-intl';
import { IconButton } from '@cefr/ui/components/icon-button';

type RowActionsProps = {
  index: number;
  count: number;
  onMove: (to: number) => void;
  onRemove: () => void;
};

export function RowActions({ index, count, onMove, onRemove }: RowActionsProps) {
  const t = useTranslations('common');
  return (
    <div className="flex shrink-0 gap-1">
      <IconButton size="xs" icon={ArrowUp} label={t('moveUp')} disabled={index === 0} onClick={() => onMove(index - 1)} />
      <IconButton size="xs" icon={ArrowDown} label={t('moveDown')} disabled={index === count - 1} onClick={() => onMove(index + 1)} />
      <IconButton size="xs" icon={Trash2} label={t('remove')} className="hover:text-error-text" onClick={onRemove} />
    </div>
  );
}
