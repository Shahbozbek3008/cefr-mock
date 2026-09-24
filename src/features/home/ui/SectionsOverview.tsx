import { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { sectionIcons } from '@/entities/test';
import type { SectionScore } from '@/entities/result';
import { MAX_SCORE, levelThresholds } from '@/shared/lib';
import { light, radius, space } from '@/shared/theme';
import { Card, Delta, IconTile, ProgressBar, Text } from '@/shared/ui';

const B2 = levelThresholds[1].min;

export type SectionsOverviewProps = {
  sections: SectionScore[];
  onPress: () => void;
};

export const SectionsOverview = memo<SectionsOverviewProps>(({ sections, onPress }) => (
  <Card radius={radius.cardLg}>
    <View style={styles.header}>
      <Text variant="labelMedium">Bo'limlar</Text>
      <View style={styles.legend}>
        <View style={styles.legendLine} />
        <Text variant="caption" color={light.textSecondary}>
          {`B2 chegarasi · ${B2}`}
        </Text>
      </View>
    </View>

    <Pressable accessibilityRole="button" onPress={onPress} style={styles.grid}>
      {sections.map((section, index) => {
        const Icon = sectionIcons[section.kind];
        const weak = Boolean(section.focus);
        return (
          <View key={section.kind} style={[styles.column, index === 0 ? styles.first : styles.rest]}>
            <IconTile background={weak ? light.warning.bg : light.bg}>
              <Icon size={16} color={weak ? light.warning.text : light.textStrong} strokeWidth={1.6} />
            </IconTile>
            <View style={styles.stat}>
              <View style={styles.valueRow}>
                <Text variant="statMd">{section.score}</Text>
                <Delta value={section.delta} />
              </View>
              <Text variant={weak ? 'microMedium' : 'micro'} color={weak ? light.warning.text : light.textSecondary}>
                {section.title}
              </Text>
            </View>
            <ProgressBar
              value={section.score / MAX_SCORE}
              height={3}
              color={weak ? light.warning[500] : light.data}
              marker={B2 / MAX_SCORE}
            />
          </View>
        );
      })}
    </Pressable>
  </Card>
));

SectionsOverview.displayName = 'SectionsOverview';

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: space[3.5],
    paddingHorizontal: space[4],
    paddingBottom: space[0.5],
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[1.5],
  },
  legendLine: {
    width: 10,
    height: 1.5,
    backgroundColor: light.borderStrong,
  },
  grid: {
    flexDirection: 'row',
  },
  column: {
    flex: 1,
    gap: space[2.5],
    paddingTop: space[3],
    paddingRight: space[2.5],
    paddingBottom: space[3.5],
  },
  first: {
    paddingLeft: space[3.5],
  },
  rest: {
    paddingLeft: space[3],
    borderLeftWidth: 1,
    borderLeftColor: light.divider,
  },
  stat: {
    gap: 3,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 5,
  },
});
