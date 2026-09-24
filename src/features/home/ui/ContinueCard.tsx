import { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { sectionIcons, sectionTitles } from '@/entities/test';
import type { TestSummary } from '@/entities/test';
import { elevation, light, radius, space } from '@/shared/theme';
import { ActionSurface, Card, Text } from '@/shared/ui';
import { ProgressRing } from '@/shared/ui/charts';
import { PlayIcon } from '@/shared/icons';

export type ContinueCardProps = {
  test: TestSummary;
  onPress: () => void;
};

export const ContinueCard = memo<ContinueCardProps>(({ test, onPress }) => {
  const section = test.resumeSection ?? 'listening';
  const Icon = sectionIcons[section];

  return (
    <Card level="raised" radius={radius.cardLg} style={styles.card}>
      <ProgressRing value={test.progress ?? 0}>
        <Icon size={17} color={light.textStrong} strokeWidth={1.5} />
      </ProgressRing>

      <View style={styles.body}>
        <Text variant="caption" color={light.textSecondary}>
          Davom ettirish
        </Text>
        <Text variant="labelMedium">{`Mock #${test.number} · ${sectionTitles[section]}`}</Text>
        {test.resumeLabel ? (
          <Text variant="monoXs" color={light.textTertiary}>
            {test.resumeLabel}
          </Text>
        ) : null}
      </View>

      <Pressable accessibilityRole="button" accessibilityLabel="Davom ettirish" onPress={onPress}>
        <ActionSurface style={[styles.play, elevation.actionSm]}>
          <PlayIcon size={18} color={light.onAction} />
        </ActionSurface>
      </Pressable>
    </Card>
  );
});

ContinueCard.displayName = 'ContinueCard';

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3.5],
    paddingVertical: space[3.5],
    paddingLeft: space[4],
    paddingRight: space[3.5],
  },
  body: {
    flex: 1,
    gap: space[0.5],
  },
  play: {
    width: 48,
    height: 48,
    borderRadius: radius.button,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
