import { ScrollView, StyleSheet } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import { useSpeakingReview } from '@/entities/result';
import { useAiReviewRequest } from '@/features/ai-review/model/useAiReviewRequest';
import { AiPendingCard } from '@/features/ai-review/ui/AiPendingCard';
import { SpeakingReviewSkeleton } from '@/features/ai-review/ui/AiReviewSkeleton';
import { CriteriaTiles } from '@/features/ai-review/ui/CriteriaTiles';
import { SpeakingAnswerCard } from '@/features/ai-review/ui/SpeakingAnswerCard';
import { TipList } from '@/features/ai-review/ui/TipList';
import { useI18n } from '@/shared/i18n';
import { levelFor } from '@/shared/lib';
import { space, useTheme } from '@/shared/theme';
import { IconButton, Screen, StateView, Text, TopBar } from '@/shared/ui';

export default function SpeakingReviewScreen() {
  const { colors } = useTheme();
  const { t } = useI18n();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const query = useSpeakingReview(id);
  const { request } = useAiReviewRequest(id, query.data?.status);
  const review = query.data?.status === 'ready' ? query.data.review : null;

  const body = () => {
    if (query.isError || query.data?.status === 'failed') {
      return (
        <StateView
          tone="error"
          title={t('common.error')}
          message={t(query.isError ? 'aiReview.loadFailed' : 'aiReview.failedMessage')}
          actionLabel={t('common.retry')}
          onAction={() => (query.isError ? query.refetch() : request().catch(() => undefined))}
        />
      );
    }
    if (!review) {
      return (
        <>
          {query.data ? <AiPendingCard /> : null}
          <SpeakingReviewSkeleton />
        </>
      );
    }
    if (review.answers.length === 0) {
      return <StateView title={t('aiReview.speakingTitle')} message={t('aiReview.noRecordings')} />;
    }
    return (
      <>
        <CriteriaTiles criteria={review.criteria} />
        {review.tips.length ? <TipList tips={review.tips} /> : null}
        <Text variant="labelMedium" style={styles.label}>
          {t('aiReview.answers')}
        </Text>
        {review.answers.map((answer) => (
          <SpeakingAnswerCard key={answer.questionId} answer={answer} />
        ))}
      </>
    );
  };

  return (
    <Screen>
      <TopBar
        centered
        left={
          <IconButton accessibilityLabel={t('common.back')} onPress={router.back}>
            <ChevronLeft size={17} color={colors.textStrong} strokeWidth={1.6} />
          </IconButton>
        }
        center={
          <>
            <Text variant="bodySmMedium">{t('aiReview.speakingTitle')}</Text>
            <Text variant="caption" color={colors.textSecondary}>
              {review ? `${review.score} · ${levelFor(review.score)}` : ' '}
            </Text>
          </>
        }
        right={null}
      />

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + space[6] }]}
        showsVerticalScrollIndicator={false}
      >
        {body()}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: space[3.5],
    gap: space[3.5],
  },
  label: {
    paddingTop: space[1.5],
    paddingHorizontal: space[1],
  },
});
