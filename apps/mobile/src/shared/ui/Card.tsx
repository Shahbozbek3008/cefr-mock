import { ReactNode, memo } from 'react';
import { LayoutChangeEvent, StyleProp, View, ViewStyle } from 'react-native';
import { makeStyles, radius as radii } from '../theme';

export type CardProps = {
  children: ReactNode;
  level?: 'line' | 'raised' | 'strong';
  radius?: number;
  style?: StyleProp<ViewStyle>;
  onLayout?: (event: LayoutChangeEvent) => void;
};

export const Card = memo<CardProps>(({ children, level = 'line', radius = radii.card, style, onLayout }) => {
  const styles = useStyles();

  return (
    <View style={[styles.card, styles[level], { borderRadius: radius }, style]} onLayout={onLayout}>
      {children}
    </View>
  );
});

Card.displayName = 'Card';

const useStyles = makeStyles(({ colors, elevation }) => ({
  card: {
    backgroundColor: colors.surface,
  },
  line: {
    ...elevation.hairline,
    borderColor: colors.hairlineSoft,
  },
  raised: elevation.card,
  strong: elevation.cardStrong,
}));
