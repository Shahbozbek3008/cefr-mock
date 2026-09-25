import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { sectionIcons } from '@/entities/test';
import type { SectionMeta } from '@/entities/test';
import { light, space } from '@/shared/theme';
import { Card, IconTile, Text } from '@/shared/ui';

export const SectionsCard = memo<{ sections: SectionMeta[] }>(({ sections }) => (
  <Card style={styles.card}>
    {sections.map((section, index) => {
      const Icon = sectionIcons[section.kind];
      return (
        <View key={section.kind} style={[styles.row, index < sections.length - 1 && styles.divider]}>
          <IconTile size={36}>
            <Icon size={17} color={light.textStrong} strokeWidth={1.5} />
          </IconTile>
          <View style={styles.body}>
            <Text variant="labelMedium">{section.title}</Text>
            <Text variant="caption" color={light.textSecondary}>
              {section.detail}
            </Text>
          </View>
          <Text variant="monoCallout" color={light.textStrong}>
            {`${section.approx ? '~' : ''}${section.minutes} daq`}
          </Text>
        </View>
      );
    })}
  </Card>
));

SectionsCard.displayName = 'SectionsCard';

const styles = StyleSheet.create({
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
    borderBottomColor: light.divider,
  },
  body: {
    flex: 1,
  },
});
