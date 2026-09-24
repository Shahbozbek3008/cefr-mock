import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Check } from 'lucide-react-native';
import { light } from '../theme';

export type CheckBadgeProps = {
  size?: number;
};

export const CheckBadge = memo<CheckBadgeProps>(({ size = 22 }) => (
  <View style={[styles.badge, { width: size, height: size, borderRadius: size / 2 }]}>
    <Check size={size * 0.55} color={light.onAction} strokeWidth={3.2} />
  </View>
));

CheckBadge.displayName = 'CheckBadge';

const styles = StyleSheet.create({
  badge: {
    backgroundColor: light.action,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
