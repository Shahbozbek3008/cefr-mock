import { memo } from 'react';
import { View } from 'react-native';
import { Check, Flame } from 'lucide-react-native';
import { sectionIcons } from '@/entities/test';
import type { SectionKind } from '@/entities/test';
import { useI18n } from '@/shared/i18n';
import { makeStyles, radius, space, useTheme } from '@/shared/theme';
import { Card, IconTile, ProgressBar, Text } from '@/shared/ui';

export type StudyWeekProps = {
  streak: number;
  studiedMinutes: number;
  goalMinutes: number;
  days: { key: string; section: SectionKind; studied: boolean; today: boolean }[];
};

export const StudyWeek = memo<StudyWeekProps>(({ streak, studiedMinutes, goalMinutes, days }) => {
  const styles = useStyles();
  const { colors } = useTheme();
  const { t, dict } = useI18n();

  return (
    <Card radius={radius.cardLg} style={styles.card}>
      <View style={styles.header}>
        <IconTile size={44} background={colors.warning.bg}>
          <Flame size={20} color={colors.streak} strokeWidth={1.7} />
        </IconTile>
        <View style={styles.summary}>
          <Text variant="heading">{t(streak > 0 ? 'home.streak' : 'home.streakStart', { count: streak })}</Text>
          <Text variant="caption" color={colors.textSecondary}>
            {t('home.goalProgress', { done: Math.min(studiedMinutes, goalMinutes), goal: goalMinutes })}
          </Text>
        </View>
      </View>

      <ProgressBar value={goalMinutes > 0 ? studiedMinutes / goalMinutes : 0} color={colors.action} />

      <View style={styles.week}>
        {days.map((day, index) => {
          const Icon = sectionIcons[day.section];
          return (
            <View key={day.key} style={styles.day}>
              <Text
                variant={day.today ? 'microMedium' : 'micro'}
                color={day.today ? colors.text : colors.textTertiary}
              >
                {dict.date.weekdaysShort[index]}
              </Text>
              <View style={[styles.tile, day.studied && styles.studied, day.today && styles.today]}>
                {day.studied ? (
                  <Check size={14} color={colors.onAction} strokeWidth={2.6} />
                ) : (
                  <Icon size={15} color={day.today ? colors.selectedText : colors.textTertiary} strokeWidth={1.6} />
                )}
              </View>
            </View>
          );
        })}
      </View>
    </Card>
  );
});

StudyWeek.displayName = 'StudyWeek';

const TILE = 34;

const useStyles = makeStyles(({ colors }) => ({
  card: {
    padding: space[4],
    gap: space[3.5],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
  },
  summary: {
    flex: 1,
    gap: space[0.5],
  },
  week: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  day: {
    alignItems: 'center',
    gap: space[1.5],
  },
  tile: {
    width: TILE,
    height: TILE,
    borderRadius: radius.sm,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  studied: {
    backgroundColor: colors.action,
  },
  today: {
    borderWidth: 1.5,
    borderColor: colors.selectedBorder,
  },
}));
