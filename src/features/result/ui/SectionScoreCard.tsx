import { memo } from 'react';
import { View } from 'react-native';
import type { SectionScore } from '@/entities/result';
import { useI18n } from '@/shared/i18n';
import { MAX_SCORE, nextLevelGap } from '@/shared/lib';
import { makeStyles, space, useTheme } from '@/shared/theme';
import { Card, Delta, ProgressBar, Text } from '@/shared/ui';

export type SectionScoreCardProps = {
  section: SectionScore;
  pending?: boolean;
};

export const SectionScoreCard = memo<SectionScoreCardProps>(({ section, pending = false }) => {
  const styles = useStyles();
  const { colors, elevation } = useTheme();
  const { t } = useI18n();
  const gap = nextLevelGap(section.score);
  const focus = Boolean(section.focus) && !pending;

  return (
    <Card style={[styles.card, focus && [styles.focus, elevation.warningRing]]}>
      <View style={styles.row}>
        <Text variant="callout" color={colors.textSecondary}>
          {section.title}
        </Text>
        {pending ? null : <Delta value={section.delta} variant="monoXs" />}
      </View>
      <View style={[styles.row, styles.baseline]}>
        <Text variant="statLg" color={pending ? colors.textTertiary : colors.text}>
          {pending ? '—' : section.score}
        </Text>
        {pending ? (
          <Text variant="microMedium" color={colors.selectedText}>
            {t('aiReview.checkingShort')}
          </Text>
        ) : focus ? (
          <Text variant="microMedium" color={colors.warning.text}>
            {t('result.focus')}
          </Text>
        ) : (
          <Text variant="monoXs" color={colors.textTertiary}>
            {gap ? `${gap.level}−${gap.points}` : 'Max'}
          </Text>
        )}
      </View>
      <ProgressBar
        value={pending ? 0 : section.score / MAX_SCORE}
        color={focus ? colors.warning[500] : colors.dataSoft}
      />
    </Card>
  );
});

SectionScoreCard.displayName = 'SectionScoreCard';

const useStyles = makeStyles(({ colors }) => ({
  card: {
    flexBasis: '47%',
    flexGrow: 1,
    padding: space[3.5],
    gap: space[3],
  },
  focus: {
    borderColor: colors.warning.border,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  baseline: {
    alignItems: 'baseline',
  },
}));
