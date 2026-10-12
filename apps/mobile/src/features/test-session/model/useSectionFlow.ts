import { useCallback, useState } from 'react';
import { BackHandler } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { completeSection, submitSession } from '@cefr/core';
import { useAttemptStore } from '@/entities/attempt';
import { notificationKeys } from '@/entities/notification';
import { resultKeys } from '@/entities/result';
import { studyKeys } from '@/entities/study';
import { testKeys } from '@/entities/test';
import type { SectionKind, TestDetail } from '@/entities/test';
import { failureReason, supabase } from '@/shared/api';
import { useI18n, useLocaleStore } from '@/shared/i18n';
import { queryClient } from '@/shared/lib';
import { useToast } from '@/shared/ui';
import { uploads } from './recordingUploads';

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
      const resultId = await submitSession(supabase, useAttemptStore, uploads, useLocaleStore.getState().locale);
      await refreshAfterSubmit();
      router.replace({ pathname: '/result/[id]', params: { id: resultId, from: 'test' } });
    } catch (error) {
      setFinishing(false);
      showToast({ message: `${t('session.submitFailed')} ${t(failureReason(error))}`, tone: 'error' });
    }
  }, [showToast, t]);

  const finish = useCallback(async () => {
    const { next, studied } = completeSection(supabase, useAttemptStore, test, section);
    studied.then((logged) => {
      if (logged) queryClient.invalidateQueries({ queryKey: studyKeys.all });
    });
    if (!next) {
      await submitTest();
      return;
    }
    router.replace({ pathname: '/test/[id]/[section]', params: { id: test.id, section: next } });
  }, [section, submitTest, test]);

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
