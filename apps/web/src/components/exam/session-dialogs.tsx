'use client';

import { useTranslations } from 'next-intl';
import { DoorOpen, Flag } from 'lucide-react';
import { nextSection, sectionTitles } from '@cefr/core';
import type { SessionControls } from '@/lib/exam/session';
import { Icon } from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { StatGrid } from '@/components/ui/stat-grid';
import { Dialog, DialogContent } from '@/components/ui/dialog';

const iconTile = (tone: string) => `grid size-[52px] place-items-center rounded-2xl ${tone}`;
const chip = 'flex h-[30px] items-center rounded-[9px] px-2.5 font-mono text-xs transition-colors duration-(--t-fast)';

type SessionDialogsProps = { controls: SessionControls; onReview?: (number: number) => void };

export function SessionDialogs({ controls, onReview }: SessionDialogsProps) {
  const t = useTranslations('exam');
  const exam = controls.mode === 'exam';
  const next = controls.test.sections.find((s) => s.kind === nextSection(controls.section));
  const failure = controls.failure && <span className="text-[13px] text-error-text">{t('session.submitFailed')} {t(`common.${controls.failure}`)}</span>;

  const review = (number: number) => {
    controls.closeFinish();
    onReview?.(number);
  };

  return (
    <>
      <Dialog open={controls.exitOpen} onOpenChange={(open) => !open && controls.closeExit()}>
        <DialogContent
          title={t(exam ? 'session.examExitTitle' : 'session.exitTitle')}
          description={t(exam ? 'session.examExitMessage' : 'session.exitMessage')}
          closeLabel={t('common.close')}
          icon={<span className={iconTile('bg-error-50 text-error-text')}><Icon as={DoorOpen} size={22} /></span>}
        >
          {failure}
          <div className="grid grid-cols-2 gap-2.5">
            <Button variant="secondary" onClick={controls.closeExit}>{t('common.continue')}</Button>
            <Button onClick={controls.confirmExit} loading={controls.finishing} className="bg-none bg-error hover:bg-error">
              {t(exam ? 'session.examExitConfirm' : 'common.exit')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={controls.finishOpen} onOpenChange={(open) => !open && controls.closeFinish()}>
        <DialogContent
          title={t('session.finishTitle', { section: sectionTitles[controls.section] })}
          description={next ? t('session.finishNext', { section: next.title, minutes: next.minutes }) : t('session.finishLast')}
          closeLabel={t('common.close')}
          icon={<span className={iconTile('bg-warning-50 text-warning-text')}><Icon as={Flag} size={22} /></span>}
        >
          {controls.stats && (
            <>
              <StatGrid
                size="lg"
                stats={[
                  { value: controls.stats.answered, label: t('session.statAnswered') },
                  { value: controls.stats.flagged, label: t('session.statFlagged'), tone: 'warning' },
                  { value: controls.stats.empty, label: t('session.statEmpty'), tone: 'error' },
                ]}
              />
              {controls.stats.emptyNumbers.length + controls.stats.flaggedNumbers.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {controls.stats.flaggedNumbers.map((n) => (
                    <button key={`f${n}`} type="button" onClick={() => review(n)} className={`${chip} bg-warning-50 text-warning-text hover:bg-warning-200`}>
                      {String(n).padStart(2, '0')}
                    </button>
                  ))}
                  {controls.stats.emptyNumbers.map((n) => (
                    <button key={`e${n}`} type="button" onClick={() => review(n)} className={`${chip} shadow-inset hover:bg-bg-app`}>
                      {String(n).padStart(2, '0')}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
          {failure}
          <div className="grid grid-cols-2 gap-2.5">
            <Button variant="secondary" onClick={controls.closeFinish}>{t('session.goBack')}</Button>
            <Button arrow onClick={controls.finish} loading={controls.finishing}>
              {controls.stats && controls.stats.empty + controls.stats.flagged > 0 ? t('session.finishAnyway') : t('common.finish')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
