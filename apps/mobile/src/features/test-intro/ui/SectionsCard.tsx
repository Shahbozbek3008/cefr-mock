import { memo } from 'react';
import { View } from 'react-native';
import { sectionDetailKeys, sectionIcons } from '@/entities/test';
import type { SectionMeta } from '@/entities/test';
import { useI18n } from '@/shared/i18n';
import { makeStyles, space, useTheme } from '@/shared/theme';
import { Card, IconTile, Text } from '@/shared/ui';

export const SectionsCard = memo<{ sections: SectionMeta[] }>(({ sections }) => {
  const styles = useStyles();
  const { colors } = useTheme();
  const { t } = useI18n();

  return (
    <Card style={styles.card}>
      {sections.map((section, index) => {
        const Icon = sectionIcons[section.kind];
        return (
          <View key={section.kind} style={[styles.row, index < sections.length - 1 && styles.divider]}>
            <IconTile size={36}>
              <Icon size={17} color={colors.textStrong} strokeWidth={1.5} />
            </IconTile>
            <View style={styles.body}>
              <Text variant="labelMedium">{section.title}</Text>
              <Text variant="caption" color={colors.textSecondary}>
                {t(sectionDetailKeys[section.kind], { parts: section.parts, questions: section.questions ?? 0 })}
              </Text>
            </View>
            <Text variant="monoCallout" color={colors.textStrong}>
              {t(section.approx ? 'units.minutesApprox' : 'units.minutes', { count: section.minutes })}
            </Text>
          </View>
        );
      })}
    </Card>
  );
});

SectionsCard.displayName = 'SectionsCard';

const useStyles = makeStyles(({ colors }) => ({
  card: {
    paddingVertical: space[1],
    paddingHorizontal: space[4],
  },
  row: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3.5],
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  body: {
    flex: 1,
  },
}));
