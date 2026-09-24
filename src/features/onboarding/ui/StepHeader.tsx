import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { light } from '@/shared/theme';
import { Text } from '@/shared/ui';

export type StepHeaderProps = {
  step: number;
  total: number;
  title: string;
  subtitle: string;
};

export const StepHeader = memo<StepHeaderProps>(({ step, total, title, subtitle }) => (
  <View style={styles.container}>
    <Text variant="monoXs" color={light.textTertiary}>
      {`${String(step).padStart(2, '0')} / ${String(total).padStart(2, '0')}`}
    </Text>
    <Text variant="titleXl">
      {title}
    </Text>
    <Text variant="labelRelaxed" color={light.textSecondary}>
      {subtitle}
    </Text>
  </View>
));

StepHeader.displayName = 'StepHeader';

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
});
