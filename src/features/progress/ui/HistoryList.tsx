import { memo } from 'react';
import { Pressable } from 'react-native';
import type { HistoryItem } from '@/entities/result';
import { makeStyles, space, useTheme } from '@/shared/theme';
import { Card, Tag, Text } from '@/shared/ui';

export type HistoryListProps = {
  items: HistoryItem[];
  onPress: (item: HistoryItem) => void;
};

export const HistoryList = memo<HistoryListProps>(({ items, onPress }) => {
  const styles = useStyles();
  const { colors } = useTheme();

  return (
    <Card style={styles.card}>
      {items.map((item, index) => (
        <Pressable
          key={item.resultId}
          accessibilityRole="button"
          accessibilityLabel={item.title}
          onPress={() => onPress(item)}
          style={[styles.row, index > 0 && styles.divider]}
        >
          <Text variant="monoXs" color={colors.textTertiary} style={styles.date}>
            {item.dateLabel}
          </Text>
          <Text variant="bodySm" style={styles.title}>
            {item.title}
          </Text>
          <Text variant="mono">{item.score}</Text>
          <Tag label={item.level} tone="lime" />
        </Pressable>
      ))}
    </Card>
  );
});

HistoryList.displayName = 'HistoryList';

const useStyles = makeStyles(({ colors }) => ({
  card: {
    paddingVertical: space[1],
    paddingHorizontal: space[4],
  },
  row: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
  },
  divider: {
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  date: {
    width: 36,
  },
  title: {
    flex: 1,
  },
}));
