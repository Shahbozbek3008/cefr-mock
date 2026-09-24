import { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { ChevronRight, Lock } from 'lucide-react-native';
import { sectionOrder, sectionTitles } from '@/entities/test';
import type { TestSummary } from '@/entities/test';
import { light, radius, space } from '@/shared/theme';
import { Button, Card, IconTile, Tag, Text } from '@/shared/ui';
import { ProgressRing } from '@/shared/ui/charts';

export type TestCardProps = {
  test: TestSummary;
  onPress: (test: TestSummary) => void;
};

const NewCard = ({ test }: { test: TestSummary }) => (
  <Card level="raised" style={styles.newCard}>
    <View style={styles.newTop}>
      <View style={styles.newInfo}>
        <View style={styles.tags}>
          {test.isNew ? <Tag label="Yangi" tone="lime" /> : null}
          {test.isFree ? <Tag label="Bepul" tone="neutral" /> : null}
        </View>
        <Text variant="heading" style={styles.newTitle}>
          {test.title}
        </Text>
        <Text variant="callout" color={light.textSecondary}>
          {test.subtitle}
        </Text>
      </View>
      <Text variant="monoSm" color={light.textTertiary}>
        {test.durationLabel}
      </Text>
    </View>
    <View style={styles.tags}>
      {sectionOrder.map((kind) => (
        <View key={kind} style={styles.sectionTag}>
          <Text variant="micro" color={light.textSecondary}>
            {sectionTitles[kind]}
          </Text>
        </View>
      ))}
    </View>
  </Card>
);

const RowCard = ({ test, onPress }: TestCardProps) => {
  const leading =
    test.status === 'in_progress' ? (
      <ProgressRing value={test.progress ?? 0}>
        <Text variant="monoNano">{`${Math.round((test.progress ?? 0) * 100)}%`}</Text>
      </ProgressRing>
    ) : test.status === 'completed' ? (
      <View style={styles.scoreTile}>
        <Text variant="labelMedium" color={light.success.text}>
          {test.score}
        </Text>
        <Text variant="pico" color={light.success[500]}>
          {test.level}
        </Text>
      </View>
    ) : (
      <IconTile size={44}>
        <Lock size={18} color={light.textSecondary} strokeWidth={1.6} />
      </IconTile>
    );

  const trailing =
    test.status === 'in_progress' ? (
      <Button label="Davom" variant="soft" size="S" onPress={() => onPress(test)} />
    ) : test.status === 'completed' ? (
      <ChevronRight size={18} color={light.textTertiary} strokeWidth={1.75} />
    ) : (
      <Tag label="Pro" tone="pro" />
    );

  return (
    <Card style={styles.rowCard}>
      {leading}
      <View style={styles.rowBody}>
        <Text variant="titleSm">{test.title}</Text>
        <Text variant="callout" color={light.textSecondary}>
          {test.subtitle}
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

const styles = StyleSheet.create({
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
    backgroundColor: light.bg,
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
    backgroundColor: light.success.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
