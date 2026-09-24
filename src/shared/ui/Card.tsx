import { ReactNode, memo } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { elevation, light, radius as radii } from '../theme';

export type CardProps = {
  children: ReactNode;
  level?: 'line' | 'raised' | 'strong';
  radius?: number;
  style?: StyleProp<ViewStyle>;
};

const levels = {
  line: [elevation.hairline, { borderColor: light.hairlineSoft }],
  raised: [elevation.card],
  strong: [elevation.cardStrong],
} as const;

export const Card = memo<CardProps>(({ children, level = 'line', radius = radii.card, style }) => (
  <View style={[styles.card, { borderRadius: radius }, ...levels[level], style]}>{children}</View>
));

Card.displayName = 'Card';

const styles = StyleSheet.create({
  card: {
    backgroundColor: light.surface,
  },
});
