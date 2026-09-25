import { memo, useCallback } from 'react';
import { sectionOrder, sectionTitles } from '@/entities/test';
import { useI18n } from '@/shared/i18n';
import { ConfirmSheet } from '@/shared/ui';
import type { SessionControls } from '../model/useSessionControls';
import { FinishSheet } from './FinishSheet';

export type SessionSheetsProps = {
  controls: SessionControls;
  onReview?: (number: number) => void;
};

const nextSectionMeta = (controls: SessionControls) => {
  const next = sectionOrder[sectionOrder.indexOf(controls.section) + 1];
  return controls.test.sections.find((s) => s.kind === next);
};

export const SessionSheets = memo<SessionSheetsProps>(({ controls, onReview }) => {
  const { closeFinish } = controls;
  const { t } = useI18n();
  const next = nextSectionMeta(controls);

  const review = useCallback(
    (number: number) => {
      closeFinish();
      onReview?.(number);
    },
    [closeFinish, onReview],
  );

  return (
    <>
      <ConfirmSheet
        visible={controls.exitOpen}
        title={t('session.exitTitle')}
        message={t('session.exitMessage')}
        confirmLabel={t('common.exit')}
        cancelLabel={t('common.continue')}
        onConfirm={controls.confirmExit}
        onClose={controls.closeExit}
      />
      <FinishSheet
        visible={controls.finishOpen}
        title={t('session.finishTitle', { section: sectionTitles[controls.section] })}
        message={
          next ? t('session.finishNext', { section: next.title, minutes: next.minutes }) : t('session.finishLast')
        }
        stats={controls.stats}
        loading={controls.finishing}
        onReview={review}
        onFinish={controls.finish}
        onClose={closeFinish}
      />
    </>
  );
});

SessionSheets.displayName = 'SessionSheets';
