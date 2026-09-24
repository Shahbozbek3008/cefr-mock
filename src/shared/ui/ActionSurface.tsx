import { ReactNode, memo } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { gradientDirection, light } from '../theme';

export type ActionSurfaceProps = {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export const ActionSurface = memo<ActionSurfaceProps>(({ children, style }) => (
  <LinearGradient
    colors={light.actionGradient}
    start={gradientDirection.vertical.start}
    end={gradientDirection.vertical.end}
    style={style}
  >
    {children}
  </LinearGradient>
));

ActionSurface.displayName = 'ActionSurface';
