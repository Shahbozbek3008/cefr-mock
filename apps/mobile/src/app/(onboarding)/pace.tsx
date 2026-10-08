import { useCallback } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowRight, Bell, ChevronLeft } from 'lucide-react-native';
import { useUserStore } from '@/entities/user/model';
import type { DailyMinutes } from '@/entities/user/model';
import { paceOptions } from '@/features/onboarding/model';
import { PaceCard } from '@/features/onboarding/ui/PaceCard';
import { StepHeader } from '@/features/onboarding/ui/StepHeader';
import { useI18n } from '@/shared/i18n';
import { makeStyles, radius, useTheme } from '@/shared/theme';
import { Button, Card, IconButton, ProgressSteps, Screen, Switch, Text } from '@/shared/ui';

export default function PaceScreen() {
  const styles = useStyles();
  const { colors } = useTheme();
  const { t } = useI18n();
  const insets = useSafeAreaInsets();
  const dailyMinutes = useUserStore((state) => state.dailyMinutes);
  const setDailyMinutes = useUserStore((state) => state.setDailyMinutes);
  const reminderEnabled = useUserStore((state) => state.reminderEnabled);
  const setReminderEnabled = useUserStore((state) => state.setReminderEnabled);
  const completeOnboarding = useUserStore((state) => state.completeOnboarding);

  const onSelect = useCallback((minutes: DailyMinutes) => setDailyMinutes(minutes), [setDailyMinutes]);

  const onCreatePlan = useCallback(() => {
    completeOnboarding();
    router.replace('/(auth)/phone');
  }, [completeOnboarding]);

  return (
    <Screen paddingHorizontal={24}>
      <View style={styles.topBar}>
        <IconButton accessibilityLabel={t('common.back')} onPress={router.back} style={styles.back}>
          <ChevronLeft size={17} color={colors.textStrong} strokeWidth={1.6} />
        </IconButton>
        <ProgressSteps total={3} current={3} />
      </View>

      <View style={styles.content}>
        <StepHeader step={3} total={3} title={t('onboarding.pace.title')} subtitle={t('onboarding.pace.subtitle')} />

        <View style={styles.grid}>
          {paceOptions.map((option) => (
            <PaceCard
              key={option.minutes}
              option={option}
              selected={dailyMinutes === option.minutes}
              onSelect={onSelect}
            />
          ))}
        </View>

        <Card style={styles.reminder}>
          <View style={styles.reminderIcon}>
            <Bell size={17} color={colors.textStrong} strokeWidth={1.5} />
          </View>
          <View style={styles.reminderBody}>
            <Text variant="label">{t('onboarding.pace.reminder')}</Text>
            <Text variant="monoSm" color={colors.textSecondary}>
              20:00
            </Text>
          </View>
          <Switch
            value={reminderEnabled}
            onValueChange={setReminderEnabled}
            accessibilityLabel={t('onboarding.pace.reminder')}
          />
        </Card>
      </View>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
        <Button
          label={t('onboarding.pace.create')}
          disabled={dailyMinutes === null}
          onPress={onCreatePlan}
          trailingIcon={
            <ArrowRight
              size={18}
              color={dailyMinutes === null ? colors.disabledText : colors.onAction}
              strokeWidth={1.75}
            />
          }
        />
      </View>
    </Screen>
  );
}

const useStyles = makeStyles(({ colors }) => ({
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  reminder: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    height: 60,
    paddingHorizontal: 16,
    borderRadius: radius.cardLg,
  },
  reminderIcon: {
    width: 36,
    height: 36,
    borderRadius: 11,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reminderBody: {
    flex: 1,
  },
  footer: {
    paddingTop: 12,
  },
}));
