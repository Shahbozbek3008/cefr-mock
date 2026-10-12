import { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { sectionDetailKeys, sectionIcons, sectionTitles } from '@/entities/test';
import { useI18n } from '@/shared/i18n';
import { space, useTheme } from '@/shared/theme';
import { Card, IconTile, Text } from '@/shared/ui';
import type { PracticeItem } from '../model/filters';

export type PracticeCardProps = {
  item: PracticeItem;
  onPress: (item: PracticeItem) => void;
};

export const PracticeCard = memo<PracticeCardProps>(({ item, onPress }) => {
  const { colors } = useTheme();
  const { t } = useI18n();
  const Icon = sectionIcons[item.kind];
  const title = t('catalog.practiceTitle', { section: sectionTitles[item.kind] });

  return (
    <Pressable accessibilityRole="button" accessibilityLabel={title} onPress={() => onPress(item)}>
      <Card style={styles.card}>
        <IconTile size={44}>
          <Icon size={18} color={colors.textStrong} strokeWidth={1.5} />
        </IconTile>
        <View style={styles.body}>
          <Text variant="titleSm">{title}</Text>
          <Text variant="callout" color={colors.textSecondary}>
            {t(sectionDetailKeys[item.kind], { parts: item.parts, questions: item.questions ?? 0 })}
          </Text>
        </View>
        <Text variant="monoCallout" color={colors.textStrong}>
          {t(item.approx ? 'units.minutesApprox' : 'units.minutes', { count: item.minutes })}
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
