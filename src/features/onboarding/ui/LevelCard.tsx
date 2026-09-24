import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { light, radius } from '@/shared/theme';
import { CheckBadge, SelectCard, Text } from '@/shared/ui';
import type { LevelOption } from '../model';

export type LevelCardProps = {
  option: LevelOption;
  selected: boolean;
  onSelect: (level: LevelOption['level']) => void;
};

export const LevelCard = memo<LevelCardProps>(({ option, selected, onSelect }) => (
  <SelectCard
    selected={selected}
    onPress={() => onSelect(option.level)}
    accessibilityLabel={`${option.level} ${option.title}`}
    style={styles.card}
  >
    <View style={[styles.badge, selected ? styles.badgeSelected : styles.badgeIdle]}>
      <Text
        variant="titleBadge"
        color={selected ? light.onAction : light.text}
      >
        {option.level}
      </Text>
    </View>

    <View style={styles.body}>
      <Text variant="titleSm" color={selected ? light.selectedText : light.text}>
        {option.title}
      </Text>
      <Text
        variant="bodySm"
        color={selected ? light.selectedText : light.textSecondary}
      >
        {option.description}
      </Text>
    </View>

    {selected ? (
      <CheckBadge />
    ) : (
      <Text variant="monoSm" color={light.textTertiary}>
        {option.range}
      </Text>
    )}
  </SelectCard>
));

LevelCard.displayName = 'LevelCard';

const styles = StyleSheet.create({
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
    backgroundColor: light.bg,
  },
  badgeSelected: {
    backgroundColor: light.action,
  },
  body: {
    flex: 1,
    gap: 2,
  },
});
