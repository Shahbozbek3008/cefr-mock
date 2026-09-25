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
import { ResultSkeleton } from '@/features/result/ui/ResultSkeleton';
import { useI18n } from '@/shared/i18n';
import { MAX_SCORE, levelFor } from '@/shared/lib';
import { gradientDirection, size, space, useTheme } from '@/shared/theme';
import { Button, IconButton, Screen, StateView, Text, TopBar } from '@/shared/ui';

const FOOTER_SPACE = size.buttonM + space[3] * 2;

const reviewRoutes = {
  review: '/result/[id]/review',
  writing: '/result/[id]/writing',
  speaking: '/result/[id]/speaking',
} as const;

export default function ResultScreen() {
  const { colors } = useTheme();
  const { t } = useI18n();
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
    Share.share({ message: t('result.shareMessage', { title, score: total, max: MAX_SCORE, level: levelFor(total) }) });
  }, [result.data, t]);

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
          <IconButton accessibilityLabel={t('common.close')} onPress={close}>
            <X size={17} color={colors.textStrong} strokeWidth={1.6} />
          </IconButton>
        }
        center={
          data ? (
            <>
              <Text variant="bodySmMedium">{data.title}</Text>
              <Text variant="monoXs" color={colors.textTertiary}>
                {`${data.dateLabel} · ${data.durationLabel}`}
              </Text>
            </>
          ) : null
        }
        right={
          <IconButton accessibilityLabel={t('common.share')} onPress={share} disabled={!data}>
            <ShareIcon size={16} color={colors.textStrong} strokeWidth={1.6} />
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
              title={
                data.recommendation.level
                  ? t('result.toLevel', { level: data.recommendation.level, points: data.recommendation.points })
                  : t('result.topLevel')
              }
              detail={t('result.growthPoint', { focus: data.recommendation.focus })}
              onPress={() => openReview('writing')}
            />
          </>
        ) : result.isError ? (
          <StateView
            tone="error"
            title={t('result.notFound')}
            message={t('common.checkInternet')}
            actionLabel={t('common.retry')}
            onAction={() => result.refetch()}
          />
        ) : (
          <ResultSkeleton />
        )}
      </ScrollView>

      <LinearGradient
        colors={[colors.bgClear, colors.bg]}
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
            label={t('result.details')}
            size="M"
            disabled={!data}
            onPress={() => openReview('review')}
            trailingIcon={
              <ArrowRight size={18} color={data ? colors.onAction : colors.disabledText} strokeWidth={1.75} />
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
