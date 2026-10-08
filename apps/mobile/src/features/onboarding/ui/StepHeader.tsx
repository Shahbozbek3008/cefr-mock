import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '@/shared/theme';
import { Text } from '@/shared/ui';

export type StepHeaderProps = {
  step: number;
  total: number;
  title: string;
  subtitle: string;
};

export const StepHeader = memo<StepHeaderProps>(({ step, total, title, subtitle }) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Text variant="monoXs" color={colors.textTertiary}>
        {`${String(step).padStart(2, '0')} / ${String(total).padStart(2, '0')}`}
      </Text>
      <Text variant="titleXl">{title}</Text>
      <Text variant="labelRelaxed" color={colors.textSecondary}>
        {subtitle}
      </Text>
    </View>
  );
});

StepHeader.displayName = 'StepHeader';

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
});
