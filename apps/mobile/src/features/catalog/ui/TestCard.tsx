import { memo } from 'react';
import { Pressable, View } from 'react-native';
import { ChevronRight, Lock } from 'lucide-react-native';
import { sectionOrder, sectionTitles } from '@/entities/test';
import type { TestSummary } from '@/entities/test';
import { useI18n } from '@/shared/i18n';
import { makeStyles, radius, space, useTheme } from '@/shared/theme';
import { Button, Card, IconTile, Tag, Text } from '@/shared/ui';
import { ProgressRing } from '@/shared/ui/charts';

export type TestCardProps = {
  test: TestSummary;
  onPress: (test: TestSummary) => void;
};

const useSubtitle = (test: TestSummary) => {
  const { t, dayMonth, monthYear } = useI18n();
  const period = monthYear(test.format.month, test.format.year);
  if (test.status === 'in_progress') {
    return t('catalog.inProgress', { section: sectionTitles[test.resumeSection ?? 'listening'] });
  }
  if (test.status === 'completed' && test.completedAt) {
    return t('catalog.completedOn', { date: dayMonth(test.completedAt) });
  }
  if (test.status === 'locked') return t('catalog.premium', { period });
  return t('catalog.formatOf', { period });
};

const NewCard = ({ test }: { test: TestSummary }) => {
  const styles = useStyles();
  const { colors } = useTheme();
  const { t } = useI18n();
  const subtitle = useSubtitle(test);

  return (
    <Card level="raised" style={styles.newCard}>
      <View style={styles.newTop}>
        <View style={styles.newInfo}>
          <View style={styles.tags}>
            {test.isNew ? <Tag label={t('catalog.newBadge')} tone="lime" /> : null}
            {test.isFree ? <Tag label={t('catalog.freeBadge')} tone="neutral" /> : null}
          </View>
          <Text variant="heading" style={styles.newTitle}>
            {test.title}
          </Text>
          <Text variant="callout" color={colors.textSecondary}>
            {subtitle}
          </Text>
        </View>
        <Text variant="monoSm" color={colors.textTertiary}>
          {test.durationLabel}
        </Text>
      </View>
      <View style={styles.tags}>
        {sectionOrder.map((kind) => (
          <View key={kind} style={styles.sectionTag}>
            <Text variant="micro" color={colors.textSecondary}>
              {sectionTitles[kind]}
            </Text>
          </View>
        ))}
      </View>
    </Card>
  );
};

const RowCard = ({ test, onPress }: TestCardProps) => {
  const styles = useStyles();
  const { colors } = useTheme();
  const { t } = useI18n();
  const subtitle = useSubtitle(test);
  const leading =
    test.status === 'in_progress' ? (
      <ProgressRing value={test.progress ?? 0}>
        <Text variant="monoNano">{`${Math.round((test.progress ?? 0) * 100)}%`}</Text>
      </ProgressRing>
    ) : test.status === 'completed' ? (
      <View style={styles.scoreTile}>
        <Text variant="labelMedium" color={colors.success.text}>
          {test.score}
        </Text>
        <Text variant="pico" color={colors.success[500]}>
          {test.level}
        </Text>
      </View>
    ) : (
      <IconTile size={44}>
        <Lock size={18} color={colors.textSecondary} strokeWidth={1.6} />
      </IconTile>
    );

  const trailing =
    test.status === 'in_progress' ? (
      <Button label={t('catalog.resumeShort')} variant="soft" size="S" onPress={() => onPress(test)} />
    ) : test.status === 'completed' ? (
      <ChevronRight size={18} color={colors.textTertiary} strokeWidth={1.75} />
    ) : (
      <Tag label="Pro" tone="pro" />
    );

  return (
    <Card style={styles.rowCard}>
      {leading}
      <View style={styles.rowBody}>
        <Text variant="titleSm">{test.title}</Text>
        <Text variant="callout" color={colors.textSecondary}>
          {subtitle}
        </Text>
      </View>
      {trailing}
    </Card>
  );
};

export const TestCard = memo<TestCardProps>(({ test, onPress }) => (
  <Pressable accessibilityRole="button" accessibilityLabel={test.title} onPress={() => onPress(test)}>
    {test.status === 'new' ? <NewCard test={test} /> : <RowCard test={test} onPress={onPress} />}
  </Pressable>
));

TestCard.displayName = 'TestCard';

const useStyles = makeStyles(({ colors }) => ({
  newCard: {
    padding: space[4],
    gap: space[3],
  },
  newTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  newInfo: {
    gap: space[1],
  },
  newTitle: {
    marginTop: space[1.5],
  },
  tags: {
    flexDirection: 'row',
    gap: space[1.5],
  },
  sectionTag: {
    height: 24,
    paddingHorizontal: space[2],
    borderRadius: radius.chip,
    backgroundColor: colors.bg,
    justifyContent: 'center',
  },
  rowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3.5],
    paddingVertical: space[3.5],
    paddingHorizontal: space[4],
  },
  rowBody: {
    flex: 1,
    gap: space[0.5],
  },
  scoreTile: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.success.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
}));
