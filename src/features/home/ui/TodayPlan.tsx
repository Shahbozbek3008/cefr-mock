import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Check } from 'lucide-react-native';
import { light, radius, space } from '@/shared/theme';
import { Button, Card, Text } from '@/shared/ui';
import type { PlanItem } from '../model/plan';

export type TodayPlanProps = {
  items: PlanItem[];
  onStart: (item: PlanItem) => void;
};

export const TodayPlan = memo<TodayPlanProps>(({ items, onStart }) => {
  const done = items.filter((i) => i.done).length;
  const minutes = items.reduce((sum, i) => sum + i.minutes, 0);

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Text variant="labelMedium">Bugungi mashq</Text>
        <Text variant="monoSm" color={light.textSecondary}>
          {`${done}/${items.length} · ${minutes} daq`}
        </Text>
      </View>

      <Card radius={radius.cardLg} style={styles.card}>
        {items.map((item, index) => (
          <View key={item.id} style={[styles.row, index > 0 && styles.divider]}>
            {item.done ? (
              <View style={styles.checkDone}>
                <Check size={13} color={light.onAction} strokeWidth={3} />
              </View>
            ) : (
              <View style={styles.checkEmpty} />
            )}
            <View style={styles.body}>
              <Text variant="label" color={item.done ? light.textTertiary : light.text}>
                {item.title}
              </Text>
              <Text variant="caption" color={item.done ? light.textTertiary : light.textSecondary}>
                {item.meta}
              </Text>
            </View>
            {item.done ? null : (
              <Button label="Boshlash" variant="soft" size="S" onPress={() => onStart(item)} />
            )}
          </View>
        ))}
      </Card>
    </View>
  );
});

TodayPlan.displayName = 'TodayPlan';

const styles = StyleSheet.create({
  section: {
    gap: space[2.5],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    paddingHorizontal: space[1],
  },
  card: {
    paddingVertical: space[1],
    paddingHorizontal: space[4],
  },
  row: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
  },
  divider: {
    borderTopWidth: 1,
    borderTopColor: light.divider,
  },
  checkDone: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: light.action,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkEmpty: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: light.dataSoft,
  },
  body: {
    flex: 1,
  },
});
