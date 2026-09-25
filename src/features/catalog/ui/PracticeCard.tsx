import { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { sectionIcons } from '@/entities/test';
import { space, useTheme } from '@/shared/theme';
import { Card, IconTile, Text } from '@/shared/ui';
import type { PracticeItem } from '../model/filters';

export type PracticeCardProps = {
  item: PracticeItem;
  onPress: (item: PracticeItem) => void;
};

export const PracticeCard = memo<PracticeCardProps>(({ item, onPress }) => {
  const { colors } = useTheme();
  const Icon = sectionIcons[item.kind];
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={item.title} onPress={() => onPress(item)}>
      <Card style={styles.card}>
        <IconTile size={44}>
          <Icon size={18} color={colors.textStrong} strokeWidth={1.5} />
        </IconTile>
        <View style={styles.body}>
          <Text variant="titleSm">{item.title}</Text>
          <Text variant="callout" color={colors.textSecondary}>
            {item.detail}
          </Text>
        </View>
        <Text variant="monoCallout" color={colors.textStrong}>
          {item.minutes}
        </Text>
        <ChevronRight size={18} color={colors.textTertiary} strokeWidth={1.75} />
      </Card>
    </Pressable>
  );
});

PracticeCard.displayName = 'PracticeCard';

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3.5],
    paddingVertical: space[3.5],
    paddingHorizontal: space[4],
  },
  body: {
    flex: 1,
    gap: space[0.5],
  },
});
