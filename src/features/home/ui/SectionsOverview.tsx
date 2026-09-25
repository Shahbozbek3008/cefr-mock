import { memo } from 'react';
import { Pressable, View } from 'react-native';
import { sectionIcons } from '@/entities/test';
import type { SectionScore } from '@/entities/result';
import { useI18n } from '@/shared/i18n';
import { MAX_SCORE, levelThresholds } from '@/shared/lib';
import { makeStyles, radius, space, useTheme } from '@/shared/theme';
import { Card, Delta, IconTile, ProgressBar, Text } from '@/shared/ui';

const B2 = levelThresholds[1].min;

export type SectionsOverviewProps = {
  sections: SectionScore[];
  onPress: () => void;
};

export const SectionsOverview = memo<SectionsOverviewProps>(({ sections, onPress }) => {
  const styles = useStyles();
  const { colors } = useTheme();
  const { t } = useI18n();

  return (
    <Card radius={radius.cardLg}>
      <View style={styles.header}>
        <Text variant="labelMedium">{t('home.sections')}</Text>
        <View style={styles.legend}>
          <View style={styles.legendLine} />
          <Text variant="caption" color={colors.textSecondary}>
            {t('home.b2Threshold', { score: B2 })}
          </Text>
        </View>
      </View>

      <Pressable accessibilityRole="button" onPress={onPress} style={styles.grid}>
        {sections.map((section, index) => {
          const Icon = sectionIcons[section.kind];
          const weak = Boolean(section.focus);
          return (
            <View key={section.kind} style={[styles.column, index === 0 ? styles.first : styles.rest]}>
              <IconTile background={weak ? colors.warning.bg : colors.bg}>
                <Icon size={16} color={weak ? colors.warning.text : colors.textStrong} strokeWidth={1.6} />
              </IconTile>
              <View style={styles.stat}>
                <View style={styles.valueRow}>
                  <Text variant="statMd">{section.score}</Text>
                  <Delta value={section.delta} />
                </View>
                <Text
                  variant={weak ? 'microMedium' : 'micro'}
                  color={weak ? colors.warning.text : colors.textSecondary}
                >
                  {section.title}
                </Text>
              </View>
              <ProgressBar
                value={section.score / MAX_SCORE}
                height={3}
                color={weak ? colors.warning[500] : colors.data}
                marker={B2 / MAX_SCORE}
              />
            </View>
          );
        })}
      </Pressable>
    </Card>
  );
});

SectionsOverview.displayName = 'SectionsOverview';

const useStyles = makeStyles(({ colors }) => ({
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
    backgroundColor: colors.borderStrong,
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
    borderLeftColor: colors.divider,
  },
  stat: {
    gap: 3,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 5,
  },
}));
