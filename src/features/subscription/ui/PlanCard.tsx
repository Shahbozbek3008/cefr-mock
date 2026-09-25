import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { light, radius, space } from '@/shared/theme';
import { Radio, SelectCard, Tag, Text } from '@/shared/ui';
import { formatSum, perMonth } from '../model/plans';
import type { Plan, PlanId } from '../model/plans';

export type PlanCardProps = {
  plan: Plan;
  selected: boolean;
  onSelect: (id: PlanId) => void;
};

export const PlanCard = memo<PlanCardProps>(({ plan, selected, onSelect }) => (
  <SelectCard
    selected={selected}
    onPress={() => onSelect(plan.id)}
    accessibilityLabel={`${plan.title} ${formatSum(plan.price)} so'm`}
    style={styles.card}
  >
    <Radio selected={selected} />
    <View style={styles.body}>
      <View style={styles.titleRow}>
        <Text variant="labelMedium">{plan.title}</Text>
        {plan.discount ? <Tag label={`−${plan.discount}%`} tone="success" size="xs" /> : null}
      </View>
      <Text variant="caption" color={light.textSecondary}>
        {plan.months === 1 ? "so'm / oy" : `${formatSum(perMonth(plan))} so'm / oy`}
      </Text>
    </View>
    <Text variant="monoMedium">{formatSum(plan.price)}</Text>
  </SelectCard>
));

PlanCard.displayName = 'PlanCard';

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3.5],
    paddingVertical: space[3.5],
    paddingHorizontal: space[4],
    borderRadius: radius.xl,
  },
  body: {
    flex: 1,
    gap: space[0.5],
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2],
  },
});
