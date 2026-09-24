import { ReactNode, memo } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { gradientDirection, light } from '../theme';

export type HeroSurfaceProps = {
  children?: ReactNode;
  colors?: readonly [string, string];
  style?: StyleProp<ViewStyle>;
};

export const HeroSurface = memo<HeroSurfaceProps>(({ children, colors = light.hero, style }) => (
  <LinearGradient
    colors={colors}
    start={gradientDirection.diagonal.start}
    end={gradientDirection.diagonal.end}
    style={style}
  >
    {children}
  </LinearGradient>
));

HeroSurface.displayName = 'HeroSurface';
