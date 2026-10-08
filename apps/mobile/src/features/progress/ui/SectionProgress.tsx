import { memo } from 'react';
import { View } from 'react-native';
import type { ProgressData } from '@/entities/result';
import { useI18n } from '@/shared/i18n';
import { MAX_SCORE } from '@/shared/lib';
import { makeStyles, space, useTheme } from '@/shared/theme';
import { Card, Delta, Dot, ProgressBar, Text } from '@/shared/ui';

export type SectionProgressProps = {
  sections: ProgressData['sections'];
  periodLabel: string;
};

export const SectionProgress = memo<SectionProgressProps>(({ sections, periodLabel }) => {
  const styles = useStyles();
  const { colors } = useTheme();
  const { t } = useI18n();

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Text variant="bodySmMedium">{t('progress.sections')}</Text>
        <Text variant="caption" color={colors.textSecondary}>
          {periodLabel}
        </Text>
      </View>
      {sections.map((section, index) => (
        <View key={section.title} style={[styles.row, index < sections.length - 1 && styles.divider]}>
          <View style={styles.title}>
            <Text variant="bodySm">{section.title}</Text>
            {section.weak ? <Dot color={colors.warning[500]} /> : null}
          </View>
          <ProgressBar
            value={section.score / MAX_SCORE}
            color={section.weak ? colors.warning[500] : colors.data}
            style={styles.bar}
          />
          <View style={styles.value}>
            <Text variant="monoCallout">{section.score}</Text>
            <Delta value={section.delta} />
          </View>
        </View>
      ))}
    </Card>
  );
});

SectionProgress.displayName = 'SectionProgress';

const useStyles = makeStyles(({ colors }) => ({
  card: {
    paddingHorizontal: space[4],
    paddingBottom: space[1],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: space[3],
    paddingBottom: space[1],
  },
  row: {
    height: 46,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  title: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[1.5],
  },
  bar: {
    width: 90,
  },
  value: {
    width: 44,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'baseline',
    gap: space[1],
  },
}));
