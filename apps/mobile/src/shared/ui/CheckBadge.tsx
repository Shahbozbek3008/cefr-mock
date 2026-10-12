import { memo } from 'react';
import { View } from 'react-native';
import { Check } from 'lucide-react-native';
import { makeStyles, useTheme } from '../theme';

export type CheckBadgeProps = {
  size?: number;
};

export const CheckBadge = memo<CheckBadgeProps>(({ size = 22 }) => {
  const styles = useStyles();
  const { colors } = useTheme();

  return (
    <View style={[styles.badge, { width: size, height: size, borderRadius: size / 2 }]}>
      <Check size={size * 0.55} color={colors.onAction} strokeWidth={3.2} />
    </View>
  );
});

CheckBadge.displayName = 'CheckBadge';

const useStyles = makeStyles(({ colors }) => ({
  badge: {
    backgroundColor: colors.action,
    alignItems: 'center',
    justifyContent: 'center',
  },
}));
