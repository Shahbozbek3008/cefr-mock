import { useCallback, useState } from 'react';
import { ScrollView, Share, StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowRight, Share as ShareIcon, X } from 'lucide-react-native';
import { useResult } from '@/entities/result';
import { AiReviewButton } from '@/features/result/ui/AiReviewButton';
import { AiReviewSheet } from '@/features/result/ui/AiReviewSheet';
import { RecommendationCard } from '@/features/result/ui/RecommendationCard';
import { ResultGauge } from '@/features/result/ui/ResultGauge';
import { SectionScoreCard } from '@/features/result/ui/SectionScoreCard';
import { MAX_SCORE, levelFor } from '@/shared/lib';
import { gradientDirection, light, size, space } from '@/shared/theme';
import { Button, IconButton, Screen, SkeletonCard, StateView, Text, TopBar } from '@/shared/ui';

const FOOTER_SPACE = size.buttonM + space[3] * 2;

const reviewRoutes = {
  review: '/result/[id]/review',
  writing: '/result/[id]/writing',
  speaking: '/result/[id]/speaking',
} as const;

export default function ResultScreen() {
  const insets = useSafeAreaInsets();
  const { id, from } = useLocalSearchParams<{ id: string; from?: string }>();
  const result = useResult(id);
  const [aiOpen, setAiOpen] = useState(false);

  const close = useCallback(() => {
    if (from === 'test') router.dismissTo('/(tabs)/home');
    else router.back();
  }, [from]);

  const share = useCallback(() => {
    if (!result.data) return;
    const { title, total } = result.data;
    Share.share({ message: `CEFR Mock · ${title}: ${total}/${MAX_SCORE} (${levelFor(total)})` });
  }, [result.data]);

  const openReview = useCallback(
    (screen: keyof typeof reviewRoutes) => {
      setAiOpen(false);
      router.push({ pathname: reviewRoutes[screen], params: { id } });
    },
    [id],
  );

  const data = result.data;

  return (
    <Screen>
      <TopBar
        centered
        left={
          <IconButton accessibilityLabel="Yopish" onPress={close}>
            <X size={17} color={light.textStrong} strokeWidth={1.6} />
          </IconButton>
        }
        center={
          data ? (
            <>
              <Text variant="bodySmMedium">{data.title}</Text>
              <Text variant="monoXs" color={light.textTertiary}>
                {`${data.dateLabel} · ${data.durationLabel}`}
              </Text>
            </>
          ) : null
        }
        right={
          <IconButton accessibilityLabel="Ulashish" onPress={share} disabled={!data}>
            <ShareIcon size={16} color={light.textStrong} strokeWidth={1.6} />
          </IconButton>
        }
      />

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + FOOTER_SPACE + space[4] }]}
        showsVerticalScrollIndicator={false}
      >
        {data ? (
          <>
            <ResultGauge total={data.total} delta={data.delta} />
            <View style={styles.grid}>
              {data.sections.map((section) => (
                <SectionScoreCard key={section.kind} section={section} />
              ))}
            </View>
            <RecommendationCard
              title={data.recommendation.title}
              detail={data.recommendation.detail}
              onPress={() => openReview('writing')}
            />
          </>
        ) : result.isError ? (
          <StateView
            tone="error"
            title="Natija topilmadi"
            message="Internetni tekshiring"
            actionLabel="Qayta"
            onAction={() => result.refetch()}
          />
        ) : (
          <>
            <SkeletonCard lines={5} />
            <SkeletonCard lines={3} />
          </>
        )}
      </ScrollView>

      <LinearGradient
        colors={[light.bgClear, light.bg]}
        locations={[0, 0.26]}
        start={gradientDirection.vertical.start}
        end={gradientDirection.vertical.end}
        style={[styles.footer, { paddingBottom: Math.max(insets.bottom, space[3]) }]}
      >
        <View style={styles.ai}>
          <AiReviewButton onPress={() => setAiOpen(true)} />
        </View>
        <View style={styles.primary}>
          <Button
            label="Batafsil tahlil"
            size="M"
            disabled={!data}
            onPress={() => openReview('review')}
            trailingIcon={
              <ArrowRight size={18} color={data ? light.onAction : light.disabledText} strokeWidth={1.75} />
            }
          />
        </View>
      </LinearGradient>

      <AiReviewSheet
        visible={aiOpen}
        onWriting={() => openReview('writing')}
        onSpeaking={() => openReview('speaking')}
        onClose={() => setAiOpen(false)}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: space[3.5],
    gap: space[3.5],
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space[2.5],
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    gap: space[2.5],
    paddingTop: space[3],
    paddingHorizontal: size.screenPadding,
  },
  ai: {
    flex: 1.1,
  },
  primary: {
    flex: 1,
  },
});
