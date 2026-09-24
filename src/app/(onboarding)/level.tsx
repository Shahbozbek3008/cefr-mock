import { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowRight, Info } from 'lucide-react-native';
import { useUserStore } from '@/entities/user/model';
import type { TargetLevel } from '@/entities/user/model';
import { levelOptions } from '@/features/onboarding/model';
import { LevelCard } from '@/features/onboarding/ui/LevelCard';
import { StepHeader } from '@/features/onboarding/ui/StepHeader';
import { light } from '@/shared/theme';
import { Button, ProgressSteps, Screen, Text } from '@/shared/ui';

export default function LevelScreen() {
  const insets = useSafeAreaInsets();
  const targetLevel = useUserStore((state) => state.targetLevel);
  const setTargetLevel = useUserStore((state) => state.setTargetLevel);

  const onSelect = useCallback(
    (level: TargetLevel) => setTargetLevel(level),
    [setTargetLevel],
  );

  const onContinue = useCallback(() => {
    router.push('/(onboarding)/exam-date');
  }, []);

  return (
    <Screen paddingHorizontal={24}>
      <View style={styles.topBar}>
        <ProgressSteps total={3} current={1} />
        <Text variant="bodySm" color={light.textSecondary}>
          O'tkazish
        </Text>
      </View>

      <View style={styles.content}>
        <StepHeader
          step={1}
          total={3}
          title="Qaysi darajani maqsad qilgansiz?"
          subtitle="Mashqlar va tavsiyalar shu darajaga moslanadi. Keyin o'zgartirish mumkin."
        />

        <View style={styles.options}>
          {levelOptions.map((option) => (
            <LevelCard
              key={option.level}
              option={option}
              selected={targetLevel === option.level}
              onSelect={onSelect}
            />
          ))}
        </View>

        <View style={styles.hint}>
          <Info size={16} color={light.textSecondary} strokeWidth={1.6} />
          <Text variant="calloutRelaxed" color={light.textSecondary} style={styles.hintText}>
            Ko'pchilik universitetlar B2 (51+) talab qiladi.
          </Text>
        </View>
      </View>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
        <Button
          label="Davom etish"
          disabled={targetLevel === null}
          onPress={onContinue}
          trailingIcon={
            <ArrowRight
              size={18}
              color={targetLevel === null ? light.disabledText : light.onAction}
              strokeWidth={1.75}
            />
          }
        />
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
  content: {
    flex: 1,
    gap: 28,
    paddingTop: 28,
  },
  options: {
    gap: 10,
  },
  hint: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 4,
  },
  hintText: {
    flex: 1,
  },
  footer: {
    paddingTop: 12,
  },
});
