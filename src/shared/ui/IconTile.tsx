import { ReactNode, memo } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { radius, useTheme } from '../theme';

export type IconTileProps = {
  children: ReactNode;
  size?: 32 | 36 | 44;
  background?: string;
  style?: ViewStyle;
};

const radii = { 32: radius.sm, 36: radius.tile, 44: radius.md } as const;

export const IconTile = memo<IconTileProps>(({ children, size = 32, background, style }) => {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.tile,
        { width: size, height: size, borderRadius: radii[size], backgroundColor: background ?? colors.bg },
        style,
      ]}
    >
      {children}
    </View>
  );
});

IconTile.displayName = 'IconTile';

const styles = StyleSheet.create({
  tile: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
