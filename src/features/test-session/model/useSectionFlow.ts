import { useCallback, useState } from 'react';
import { BackHandler } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { useAttemptStore } from '@/entities/attempt';
import { fetchResults, fetchSpeakingReview, fetchWritingReview, resultKeys, useResultStore } from '@/entities/result';
import { sectionOrder } from '@/entities/test';
import type { SectionKind, TestDetail } from '@/entities/test';
import { queryClient } from '@/shared/lib';
import { buildResult } from './buildResult';

const nextSection = (section: SectionKind) => sectionOrder[sectionOrder.indexOf(section) + 1] ?? null;

export const useSectionFlow = (test: TestDetail, section: SectionKind) => {
  const [finishing, setFinishing] = useState(false);

  const finish = useCallback(async () => {
    const attempt = useAttemptStore.getState();
    attempt.completeSection(section);

    const next = nextSection(section);
    if (next) {
      router.replace({ pathname: '/test/[id]/[section]', params: { id: test.id, section: next } });
      return;
    }

    setFinishing(true);
    const [writing, speaking, previous] = await Promise.all([
      fetchWritingReview(),
      fetchSpeakingReview(),
      fetchResults(),
    ]);
    const result = buildResult(
      test,
      { answers: attempt.answers, startedAt: attempt.startedAt },
      { writing: writing.score, speaking: speaking.criteria },
      previous[0],
    );

    useResultStore.getState().add(result);
    await queryClient.invalidateQueries({ queryKey: resultKeys.all });
    attempt.reset();
    router.replace({ pathname: '/result/[id]', params: { id: result.id, from: 'test' } });
  }, [section, test]);

  return { finish, finishing };
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
