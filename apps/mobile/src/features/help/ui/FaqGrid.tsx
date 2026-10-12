import { memo } from 'react';
import { Pressable, View } from 'react-native';
import { ArrowUpRight } from 'lucide-react-native';
import { useI18n } from '@/shared/i18n';
import { makeStyles, radius, space, useTheme } from '@/shared/theme';
import { IconTile, Text } from '@/shared/ui';
import type { FaqTopic } from '../model/faq';

export type FaqGridProps = {
  topics: FaqTopic[];
  onOpen: (topic: FaqTopic) => void;
};

export const FaqGrid = memo<FaqGridProps>(({ topics, onOpen }) => {
  const styles = useStyles();
  const { colors } = useTheme();
  const { t } = useI18n();

  return (
    <View style={styles.grid}>
      {topics.map((topic) => {
        const Icon = topic.icon;
        return (
          <Pressable
            key={topic.id}
            accessibilityRole="button"
            accessibilityLabel={t(topic.question)}
            onPress={() => onOpen(topic)}
            style={({ pressed }) => [styles.tile, pressed && styles.pressed]}
          >
            <View style={styles.top}>
              <IconTile size={36} background={colors.selectedBg}>
                <Icon size={17} color={colors.selectedText} strokeWidth={1.7} />
              </IconTile>
              <ArrowUpRight size={16} color={colors.textTertiary} strokeWidth={1.7} />
            </View>
            <Text variant="bodySmMedium" numberOfLines={3}>
              {t(topic.question)}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
});

FaqGrid.displayName = 'FaqGrid';

const TILE_MIN_HEIGHT = 128;

const useStyles = makeStyles(({ colors }) => ({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space[2.5],
  },
  tile: {
    flexBasis: '47%',
    flexGrow: 1,
    minHeight: TILE_MIN_HEIGHT,
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.hairlineSoft,
    padding: space[3.5],
    gap: space[3],
  },
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  pressed: {
    opacity: 0.6,
  },
}));
