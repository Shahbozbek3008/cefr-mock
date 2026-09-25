import { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { space, useTheme } from '@/shared/theme';
import { Card, Text } from '@/shared/ui';
import { AiTile } from './AiTile';

export type RecommendationCardProps = {
  title: string;
  detail: string;
  onPress: () => void;
};

export const RecommendationCard = memo<RecommendationCardProps>(({ title, detail, onPress }) => {
  const { colors } = useTheme();

  return (
    <Pressable accessibilityRole="button" accessibilityLabel={title} onPress={onPress}>
      <Card style={styles.card}>
        <AiTile />
        <View style={styles.body}>
          <Text variant="bodySmMedium">{title}</Text>
          <Text variant="caption" color={colors.textSecondary}>
            {detail}
          </Text>
        </View>
        <ChevronRight size={18} color={colors.textTertiary} strokeWidth={1.75} />
      </Card>
    </Pressable>
  );
});

RecommendationCard.displayName = 'RecommendationCard';

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
    paddingVertical: space[3.5],
    paddingHorizontal: space[4],
  },
  body: {
    flex: 1,
    gap: space[0.5],
  },
});
