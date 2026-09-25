import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import type { SectionScore } from '@/entities/result';
import { MAX_SCORE, nextLevelGap } from '@/shared/lib';
import { elevation, light, space } from '@/shared/theme';
import { Card, Delta, ProgressBar, Text } from '@/shared/ui';

export const SectionScoreCard = memo<{ section: SectionScore }>(({ section }) => {
  const gap = nextLevelGap(section.score);
  const focus = Boolean(section.focus);

  return (
    <Card style={[styles.card, focus && [styles.focus, elevation.warningRing]]}>
      <View style={styles.row}>
        <Text variant="callout" color={light.textSecondary}>
          {section.title}
        </Text>
        <Delta value={section.delta} variant="monoXs" />
      </View>
      <View style={[styles.row, styles.baseline]}>
        <Text variant="statLg">{section.score}</Text>
        {focus ? (
          <Text variant="microMedium" color={light.warning.text}>
            Fokus
          </Text>
        ) : (
          <Text variant="monoXs" color={light.textTertiary}>
            {gap ? `${gap.level}−${gap.points}` : 'Max'}
          </Text>
        )}
      </View>
      <ProgressBar value={section.score / MAX_SCORE} color={focus ? light.warning[500] : light.dataSoft} />
    </Card>
  );
});

SectionScoreCard.displayName = 'SectionScoreCard';

const styles = StyleSheet.create({
  card: {
    flexBasis: '47%',
    flexGrow: 1,
    padding: space[3.5],
    gap: space[3],
  },
  focus: {
    borderColor: light.warning.border,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  baseline: {
    alignItems: 'baseline',
  },
});
