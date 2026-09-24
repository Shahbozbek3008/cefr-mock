import { memo } from 'react';
import { light, TypeToken } from '../theme';
import { Text } from './Text';

export type DeltaProps = {
  value: number;
  variant?: TypeToken;
};

export const Delta = memo<DeltaProps>(({ value, variant = 'monoNano' }) => {
  const color = value > 0 ? light.success.text : value < 0 ? light.error.text : light.textTertiary;
  const label = value > 0 ? `+${value}` : value < 0 ? `−${Math.abs(value)}` : '0';

  return (
    <Text variant={variant} color={color}>
      {label}
    </Text>
  );
});

Delta.displayName = 'Delta';
