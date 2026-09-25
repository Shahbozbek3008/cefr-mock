import { memo } from 'react';
import { useAttemptStore } from '@/entities/attempt';
import type { SectionKind } from '@/entities/test';
import { TimerPill } from '@/shared/ui';

export type SectionTimerProps = {
  section: SectionKind;
  onExpire: () => void;
};

export const SectionTimer = memo<SectionTimerProps>(({ section, onExpire }) => {
  const endsAt = useAttemptStore((s) => s.endsAt[section]);
  if (!endsAt) return null;
  return <TimerPill endsAt={endsAt} onExpire={onExpire} />;
});

SectionTimer.displayName = 'SectionTimer';
