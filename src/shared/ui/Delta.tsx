import { memo } from 'react';
import { TypeToken, useTheme } from '../theme';
import { Text } from './Text';

export type DeltaProps = {
  value: number;
  variant?: TypeToken;
};

export const Delta = memo<DeltaProps>(({ value, variant = 'monoNano' }) => {
  const { colors } = useTheme();
  const color = value > 0 ? colors.success.text : value < 0 ? colors.error.text : colors.textTertiary;
  const label = value > 0 ? `+${value}` : value < 0 ? `−${Math.abs(value)}` : '0';

  return (
    <Text variant={variant} color={color}>
      {label}
    </Text>
  );
});

Delta.displayName = 'Delta';
