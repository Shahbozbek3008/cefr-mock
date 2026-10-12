import { ReactNode, memo } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { gradientDirection, useTheme } from '../theme';

export type ActionSurfaceProps = {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export const ActionSurface = memo<ActionSurfaceProps>(({ children, style }) => {
  const { colors } = useTheme();

  return (
    <LinearGradient
      colors={colors.actionGradient}
      start={gradientDirection.vertical.start}
      end={gradientDirection.vertical.end}
      style={style}
    >
      {children}
    </LinearGradient>
  );
});

ActionSurface.displayName = 'ActionSurface';
