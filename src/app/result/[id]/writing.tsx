import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowRight, ChevronLeft } from 'lucide-react-native';
import { useWritingReview } from '@/entities/result';
import { CriteriaList } from '@/features/ai-review/ui/CriteriaList';
import { ErrorsCard } from '@/features/ai-review/ui/ErrorsCard';
import { ImprovedSheet } from '@/features/ai-review/ui/ImprovedSheet';
import { ScoreHero } from '@/features/ai-review/ui/ScoreHero';
import { WritingReviewSkeleton } from '@/features/ai-review/ui/AiReviewSkeleton';
import { useI18n } from '@/shared/i18n';
import { size, space, useTheme } from '@/shared/theme';
import { Button, IconButton, Screen, StateView, Text, TopBar } from '@/shared/ui';

const FOOTER_SPACE = size.buttonL + space[3];

export default function WritingReviewScreen() {
  const { colors } = useTheme();
  const { t } = useI18n();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const review = useWritingReview(id);
  const [improvedOpen, setImprovedOpen] = useState(false);
  const data = review.data;

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
              {data ? t('aiReview.writingMeta', { task: data.taskLabel, count: data.words }) : ' '}
            </Text>
          </>
        }
        right={null}
      />

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + FOOTER_SPACE + space[6] }]}
        showsVerticalScrollIndicator={false}
      >
        {data ? (
          <>
            <ScoreHero
              label={t('aiReview.writingScore')}
              score={data.score}
              verdict={`${data.level} · ${data.levelNote}`}
              summary={data.summary}
            />
            <CriteriaList criteria={data.criteria} />
            <ErrorsCard segments={data.segments} corrections={data.corrections} />
          </>
        ) : review.isError ? (
          <StateView
            tone="error"
            title={t('common.error')}
            message={t('aiReview.loadFailed')}
            actionLabel={t('common.retry')}
            onAction={() => review.refetch()}
          />
        ) : (
          <WritingReviewSkeleton />
        )}
      </ScrollView>

      <View style={[styles.footer, { bottom: insets.bottom + space[3] }]}>
        <Button
          label={t('aiReview.showImproved')}
          disabled={!data}
          onPress={() => setImprovedOpen(true)}
          trailingIcon={
            <ArrowRight size={18} color={data ? colors.onAction : colors.disabledText} strokeWidth={1.75} />
          }
        />
      </View>

      <ImprovedSheet visible={improvedOpen} text={data?.improved ?? ''} onClose={() => setImprovedOpen(false)} />
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
