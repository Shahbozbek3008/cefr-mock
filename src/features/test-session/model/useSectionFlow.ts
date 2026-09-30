import { useCallback, useState } from 'react';
import { BackHandler } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { submitAttempt, useAttemptStore } from '@/entities/attempt';
import { notificationKeys } from '@/entities/notification';
import { requestAiReview, resultKeys } from '@/entities/result';
import { logStudy } from '@/entities/study';
import { sectionOrder, testKeys } from '@/entities/test';
import type { SectionKind, TestDetail } from '@/entities/test';
import { failureReason } from '@/shared/api';
import { useI18n } from '@/shared/i18n';
import { queryClient } from '@/shared/lib';
import { useToast } from '@/shared/ui';
import { flushAttempt } from './attemptSession';
import { flushUploads } from './recordingUploads';

const nextSection = (section: SectionKind) => sectionOrder[sectionOrder.indexOf(section) + 1] ?? null;

const refreshAfterSubmit = () =>
  Promise.all(
    [resultKeys.all, testKeys.all, notificationKeys.all].map((queryKey) => queryClient.invalidateQueries({ queryKey })),
  );

export const useSectionFlow = (test: TestDetail, section: SectionKind) => {
  const [finishing, setFinishing] = useState(false);
  const showToast = useToast((s) => s.show);
  const { t } = useI18n();

  const submitTest = useCallback(async () => {
    setFinishing(true);
    try {
      await flushUploads();
      await flushAttempt();
      const { attemptId } = useAttemptStore.getState();
      if (!attemptId) throw new Error('attempt_missing');
      const resultId = await submitAttempt(attemptId);
      requestAiReview(resultId).catch(() => undefined);
      await refreshAfterSubmit();
      useAttemptStore.getState().reset();
      router.replace({ pathname: '/result/[id]', params: { id: resultId, from: 'test' } });
    } catch (error) {
      setFinishing(false);
      showToast({ message: `${t('session.submitFailed')} ${t(failureReason(error))}`, tone: 'error' });
    }
  }, [showToast, t]);

  const finish = useCallback(async () => {
    const { endsAt } = useAttemptStore.getState();
    const limitSec = (test.sections.find((item) => item.kind === section)?.minutes ?? 0) * 60;
    const remainingSec = Math.max(0, ((endsAt[section] ?? Date.now()) - Date.now()) / 1000);
    logStudy(Math.max(0, limitSec - remainingSec)).catch(() => undefined);
    useAttemptStore.getState().completeSection(section);

    const next = nextSection(section);
    if (!next) {
      await submitTest();
      return;
    }
    flushAttempt().catch(() => undefined);
    router.replace({ pathname: '/test/[id]/[section]', params: { id: test.id, section: next } });
  }, [section, submitTest, test.id, test.sections]);

  return { finish, finishing, submitTest };
};

export const useBackGuard = (onBack: () => void) => {
  useFocusEffect(
    useCallback(() => {
      const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
        onBack();
        return true;
      });
      return () => subscription.remove();
    }, [onBack]),
  );
};
