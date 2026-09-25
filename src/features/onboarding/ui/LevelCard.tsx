import { memo } from 'react';
import { View } from 'react-native';
import { makeStyles, radius, useTheme } from '@/shared/theme';
import { CheckBadge, SelectCard, Text } from '@/shared/ui';
import type { LevelOption } from '../model';

export type LevelCardProps = {
  option: LevelOption;
  selected: boolean;
  onSelect: (level: LevelOption['level']) => void;
};

export const LevelCard = memo<LevelCardProps>(({ option, selected, onSelect }) => {
  const styles = useStyles();
  const { colors } = useTheme();

  return (
    <SelectCard
      selected={selected}
      onPress={() => onSelect(option.level)}
      accessibilityLabel={`${option.level} ${option.title}`}
      style={styles.card}
    >
      <View style={[styles.badge, selected ? styles.badgeSelected : styles.badgeIdle]}>
        <Text variant="titleBadge" color={selected ? colors.onAction : colors.text}>
          {option.level}
        </Text>
      </View>

      <View style={styles.body}>
        <Text variant="titleSm" color={selected ? colors.selectedText : colors.text}>
          {option.title}
        </Text>
        <Text variant="bodySm" color={selected ? colors.selectedText : colors.textSecondary}>
          {option.description}
        </Text>
      </View>

      {selected ? (
        <CheckBadge />
      ) : (
        <Text variant="monoSm" color={colors.textTertiary}>
          {option.range}
        </Text>
      )}
    </SelectCard>
  );
});

LevelCard.displayName = 'LevelCard';

const useStyles = makeStyles(({ colors }) => ({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 16,
    paddingHorizontal: 18,
  },
  badge: {
    width: 52,
    height: 52,
    borderRadius: radius.button,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeIdle: {
    backgroundColor: colors.bg,
  },
  badgeSelected: {
    backgroundColor: colors.action,
  },
  body: {
    flex: 1,
    gap: 2,
  },
}));
