import { ScrollView, StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import { useSpeakingReview } from '@/entities/result';
import { CriteriaTiles } from '@/features/ai-review/ui/CriteriaTiles';
import { MarkedText } from '@/features/ai-review/ui/MarkedText';
import { PlaybackCard } from '@/features/ai-review/ui/PlaybackCard';
import { TipList } from '@/features/ai-review/ui/TipList';
import { light, space } from '@/shared/theme';
import { Card, IconButton, Screen, SkeletonCard, StateView, Text, TopBar } from '@/shared/ui';

const transcriptMarks = {
  grammar: {
    backgroundColor: light.warning.bg,
    textDecorationColor: light.warning[500],
  },
};

export default function SpeakingReviewScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const review = useSpeakingReview(id);
  const data = review.data;

  return (
    <Screen>
      <TopBar
        centered
        left={
          <IconButton accessibilityLabel="Orqaga" onPress={router.back}>
            <ChevronLeft size={17} color={light.textStrong} strokeWidth={1.6} />
          </IconButton>
        }
        center={
          <>
            <Text variant="bodySmMedium">AI Speaking bahosi</Text>
            <Text variant="caption" color={light.textSecondary}>
              {data ? `${data.part} · ${data.durationSec} soniya` : ' '}
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
                <Text variant="monoXs" color={light.textTertiary}>
                  {`${data.words} so'z · ${data.wpm} wpm`}
                </Text>
              </View>
              <MarkedText segments={data.segments} overrides={transcriptMarks} />
            </Card>
            <TipList tips={data.tips} />
          </>
        ) : review.isError ? (
          <StateView
            tone="error"
            title="Xatolik"
            message="AI bahosi yuklanmadi"
            actionLabel="Qayta"
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
