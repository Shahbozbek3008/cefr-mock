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
import { size, space, useTheme } from '@/shared/theme';
import { Button, IconButton, Screen, SkeletonCard, StateView, Text, TopBar } from '@/shared/ui';

const FOOTER_SPACE = size.buttonL + space[3];

export default function WritingReviewScreen() {
  const { colors } = useTheme();
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
          <IconButton accessibilityLabel="Orqaga" onPress={router.back}>
            <ChevronLeft size={17} color={colors.textStrong} strokeWidth={1.6} />
          </IconButton>
        }
        center={
          <>
            <Text variant="bodySmMedium">AI Writing bahosi</Text>
            <Text variant="caption" color={colors.textSecondary}>
              {data ? `${data.taskLabel} · ${data.words} so'z` : ' '}
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
              label="Writing ball"
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
            title="Xatolik"
            message="AI bahosi yuklanmadi"
            actionLabel="Qayta"
            onAction={() => review.refetch()}
          />
        ) : (
          <>
            <SkeletonCard lines={3} />
            <SkeletonCard lines={4} />
            <SkeletonCard lines={5} />
          </>
        )}
      </ScrollView>

      <View style={[styles.footer, { bottom: insets.bottom + space[3] }]}>
        <Button
          label="Yaxshilangan variantni ko'rish"
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
