import { memo, useCallback } from 'react';
import { sectionOrder, sectionTitles } from '@/entities/test';
import { ConfirmSheet } from '@/shared/ui';
import type { SessionControls } from '../model/useSessionControls';
import { FinishSheet } from './FinishSheet';

export type SessionSheetsProps = {
  controls: SessionControls;
  onReview?: (number: number) => void;
};

const finishMessage = (controls: SessionControls) => {
  const next = sectionOrder[sectionOrder.indexOf(controls.section) + 1];
  const meta = controls.test.sections.find((s) => s.kind === next);
  return meta
    ? `Yakunlangach, javoblarni o'zgartirib bo'lmaydi. Keyingi bo'lim — ${meta.title}, ${meta.minutes} daqiqa.`
    : "Yakunlangach, javoblarni o'zgartirib bo'lmaydi. AI natijangizni hisoblaydi.";
};

export const SessionSheets = memo<SessionSheetsProps>(({ controls, onReview }) => {
  const { closeFinish } = controls;

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
        title="Testdan chiqasizmi?"
        message="Chiqsangiz, taymer to'xtamaydi. Javoblaringiz qurilmada saqlanadi."
        confirmLabel="Chiqish"
        cancelLabel="Davom etish"
        onConfirm={controls.confirmExit}
        onClose={controls.closeExit}
      />
      <FinishSheet
        visible={controls.finishOpen}
        title={`${sectionTitles[controls.section]}'ni yakunlaysizmi?`}
        message={finishMessage(controls)}
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
