import { useCallback } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowRight, ChevronLeft } from 'lucide-react-native';
import { useUserStore } from '@/entities/user/model';
import { Calendar } from '@/features/onboarding/ui/Calendar';
import { StepHeader } from '@/features/onboarding/ui/StepHeader';
import { daysUntil } from '@/shared/lib';
import { hitSlop, light, radius } from '@/shared/theme';
import { Button, Card, IconButton, ProgressSteps, Screen, Text } from '@/shared/ui';

export default function ExamDateScreen() {
  const insets = useSafeAreaInsets();
  const examDate = useUserStore((state) => state.examDate);
  const setExamDate = useUserStore((state) => state.setExamDate);

  const onContinue = useCallback(() => {
    router.push('/(onboarding)/pace');
  }, []);

  const onSkip = useCallback(() => {
    setExamDate(null);
    router.push('/(onboarding)/pace');
  }, [setExamDate]);

  const remaining = examDate ? daysUntil(examDate) : null;

  return (
    <Screen paddingHorizontal={24}>
      <View style={styles.topBar}>
        <IconButton accessibilityLabel="Orqaga" onPress={router.back} style={styles.back}>
          <ChevronLeft size={17} color={light.textStrong} strokeWidth={1.6} />
        </IconButton>
        <ProgressSteps total={3} current={2} />
      </View>

      <View style={styles.content}>
        <StepHeader
          step={2}
          total={3}
          title="Imtihon qachon?"
          subtitle="Tayyorgarlik rejasini sanaga qarab tuzamiz."
        />

        <Calendar value={examDate} onChange={setExamDate} />

        {remaining !== null ? (
          <Card style={styles.summary}>
            <Text variant="monoLg">
              {remaining}
            </Text>
            <Text variant="bodySm" color={light.textSecondary} style={styles.summaryText}>
              kun qoldi · haftasiga ~5 soat tavsiya etiladi
            </Text>
          </Card>
        ) : null}
      </View>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
        <Button
          label="Davom etish"
          disabled={examDate === null}
          onPress={onContinue}
          trailingIcon={
            <ArrowRight
              size={18}
              color={examDate === null ? light.disabledText : light.onAction}
              strokeWidth={1.75}
            />
          }
        />
        <Pressable
          accessibilityRole="button"
          hitSlop={hitSlop}
          onPress={onSkip}
          style={styles.skip}
        >
          <Text variant="labelMedium" color={light.link}>
            Sanani hali bilmayman
          </Text>
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  topBar: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  back: {
    marginLeft: -4,
  },
  content: {
    flex: 1,
    gap: 28,
    paddingTop: 28,
  },
  summary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: radius.lg,
  },
  summaryText: {
    flex: 1,
  },
  footer: {
    paddingTop: 12,
    gap: 6,
  },
  skip: {
    height: 44,
    justifyContent: 'center',
    paddingHorizontal: 22,
  },
});
