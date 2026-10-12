import { useTranslations } from 'next-intl';
import { CountUp } from '@cefr/ui/motion/count-up';
import { Stagger, StaggerItem } from '@cefr/ui/motion/reveal';
import { Container } from './container';
import { STATS } from '@/constants/sections';

export function StatsBand() {
  const t = useTranslations('landing.stats');
  return (
    <Container className="pt-12 md:pt-4 md:pb-8">
      <Stagger className="grid grid-cols-2 gap-px overflow-hidden rounded-card-lg bg-divider-muted shadow-e1 md:grid-cols-4">
        {STATS.map((s) => (
          <StaggerItem key={s.key} className="flex flex-col gap-1.5 bg-surface px-5 py-6 md:px-8 md:py-8">
            <span className="flex items-baseline gap-1 text-[34px] leading-none font-light tracking-[-0.05em] md:text-[44px]">
              {s.prefix}
              <CountUp value={s.value} grouped={s.grouped} duration={2} />
              {'suffix' in s && <span className="text-green">{s.suffix}</span>}
              {'unit' in s && <span className="ml-0.5 text-base tracking-normal text-ink-3 md:text-lg">{t(s.unit)}</span>}
            </span>
            <span className="text-[13px] text-ink-2 md:text-sm">{t(s.key)}</span>
          </StaggerItem>
        ))}
      </Stagger>
    </Container>
  );
}
