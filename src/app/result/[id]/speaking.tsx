import { ScrollView, StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import { useSpeakingReview } from '@/entities/result';
import { CriteriaTiles } from '@/features/ai-review/ui/CriteriaTiles';
import { MarkedText } from '@/features/ai-review/ui/MarkedText';
import { PlaybackCard } from '@/features/ai-review/ui/PlaybackCard';
import { TipList } from '@/features/ai-review/ui/TipList';
import { useI18n } from '@/shared/i18n';
import { space, useTheme } from '@/shared/theme';
import { Card, IconButton, Screen, SkeletonCard, StateView, Text, TopBar } from '@/shared/ui';

export default function SpeakingReviewScreen() {
  const { colors } = useTheme();
  const { t } = useI18n();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const review = useSpeakingReview(id);
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
            <Text variant="bodySmMedium">AI Speaking bahosi</Text>
            <Text variant="caption" color={colors.textSecondary}>
              {data ? t('aiReview.speakingMeta', { part: data.part, count: data.durationSec }) : ' '}
            </Text>
          </>
        }
        right={null}
      />

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + space[6] }]}
        showsVerticalScrollIndicator={false}
      >
        {data ? (
          <>
            <PlaybackCard durationSec={data.durationSec} bars={data.waveform} />
            <CriteriaTiles criteria={data.criteria} />
            <Card style={styles.transcript}>
              <View style={styles.transcriptHeader}>
                <Text variant="bodySmMedium">Transkript</Text>
                <Text variant="monoXs" color={colors.textTertiary}>
                  {t('aiReview.transcriptMeta', { words: data.words, wpm: data.wpm })}
                </Text>
              </View>
              <MarkedText segments={data.segments} grammarTone="warning" />
            </Card>
            <TipList tips={data.tips} />
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
          <>
            <SkeletonCard lines={2} />
            <SkeletonCard lines={4} />
            <SkeletonCard lines={5} />
          </>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: space[3.5],
    gap: space[3.5],
  },
  transcript: {
    padding: space[4],
    gap: space[2.5],
  },
  transcriptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
