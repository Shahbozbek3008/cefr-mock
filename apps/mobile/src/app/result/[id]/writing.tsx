import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowRight, ChevronLeft } from 'lucide-react-native';
import { useWritingReview } from '@/entities/result';
import { useAiReviewRequest } from '@/features/ai-review/model/useAiReviewRequest';
import { AiPendingCard } from '@/features/ai-review/ui/AiPendingCard';
import { WritingReviewSkeleton } from '@/features/ai-review/ui/AiReviewSkeleton';
import { CriteriaList } from '@/features/ai-review/ui/CriteriaList';
import { ErrorsCard } from '@/features/ai-review/ui/ErrorsCard';
import { ImprovedSheet } from '@/features/ai-review/ui/ImprovedSheet';
import { ScoreHero } from '@/features/ai-review/ui/ScoreHero';
import { useI18n } from '@/shared/i18n';
import { size, space, useTheme } from '@/shared/theme';
import { Button, IconButton, Screen, SegmentedControl, StateView, Text, TopBar } from '@/shared/ui';

const FOOTER_SPACE = size.buttonL + space[3];

export default function WritingReviewScreen() {
  const { colors } = useTheme();
  const { t } = useI18n();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const query = useWritingReview(id);
  const { request } = useAiReviewRequest(id, query.data?.status);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [improvedOpen, setImprovedOpen] = useState(false);

  const review = query.data?.status === 'ready' ? query.data.review : null;
  const tasks = useMemo(() => review?.tasks ?? [], [review]);
  const task = tasks.find((item) => item.taskId === taskId) ?? tasks[tasks.length - 1];
  const taskOptions = useMemo(() => tasks.map((item) => ({ value: item.taskId, label: item.label })), [tasks]);
  const answered = task !== undefined && task.words > 0;

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
    if (!review || !task) {
      return (
        <>
          {query.data ? <AiPendingCard /> : null}
          <WritingReviewSkeleton />
        </>
      );
    }
    return (
      <>
        {taskOptions.length > 1 ? (
          <SegmentedControl options={taskOptions} value={task.taskId} onChange={setTaskId} size="compact" />
        ) : null}
        {answered ? (
          <>
            <ScoreHero label={task.label} score={task.score} verdict={task.level} summary={task.summary} />
            <CriteriaList criteria={task.criteria} />
            <ErrorsCard segments={task.segments} corrections={task.corrections} />
          </>
        ) : (
          <StateView title={task.label} message={t('aiReview.noAnswer')} />
        )}
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
            <Text variant="bodySmMedium">{t('aiReview.writingTitle')}</Text>
            <Text variant="caption" color={colors.textSecondary}>
              {task ? t('aiReview.writingMeta', { task: task.label, count: task.words }) : ' '}
            </Text>
          </>
        }
        right={null}
      />

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + FOOTER_SPACE + space[6] }]}
        showsVerticalScrollIndicator={false}
      >
        {body()}
      </ScrollView>

      <View style={[styles.footer, { bottom: insets.bottom + space[3] }]}>
        <Button
          label={t('aiReview.showImproved')}
          disabled={!answered}
          onPress={() => setImprovedOpen(true)}
          trailingIcon={
            <ArrowRight size={18} color={answered ? colors.onAction : colors.disabledText} strokeWidth={1.75} />
          }
        />
      </View>

      <ImprovedSheet visible={improvedOpen} text={task?.improved ?? ''} onClose={() => setImprovedOpen(false)} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: space[3.5],
    gap: space[3.5],
  },
  footer: {
    position: 'absolute',
    left: size.screenPadding,
    right: size.screenPadding,
  },
});
