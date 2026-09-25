import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { radius, useTheme } from '@/shared/theme';
import { CheckBadge, SelectCard, Text } from '@/shared/ui';
import type { PaceOption } from '../model';

export type PaceCardProps = {
  option: PaceOption;
  selected: boolean;
  onSelect: (minutes: PaceOption['minutes']) => void;
};

export const PaceCard = memo<PaceCardProps>(({ option, selected, onSelect }) => {
  const { colors } = useTheme();

  return (
    <SelectCard
      selected={selected}
      onPress={() => onSelect(option.minutes)}
      accessibilityLabel={`${option.title} ${option.minutes} daqiqa`}
      style={styles.card}
    >
      <Text
        variant={selected ? 'captionMedium' : 'caption'}
        color={selected ? colors.selectedText : colors.textSecondary}
      >
        {option.title}
      </Text>

      <View style={styles.value}>
        <Text variant="numeral" color={selected ? colors.selectedText : colors.text}>
          {option.minutes === 60 ? '60+' : option.minutes}
        </Text>
        <Text variant="bodySm" color={selected ? colors.selectedText : colors.textSecondary}>
          daq
        </Text>
      </View>

      {selected ? (
        <View style={styles.check}>
          <CheckBadge />
        </View>
      ) : null}
    </SelectCard>
  );
});

PaceCard.displayName = 'PaceCard';

const styles = StyleSheet.create({
  card: {
    flexBasis: '47%',
    flexGrow: 1,
    gap: 18,
    padding: 18,
    borderRadius: radius.card,
  },
  value: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  check: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
});
