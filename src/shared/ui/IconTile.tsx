import { ReactNode, memo } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { light, radius } from '../theme';

export type IconTileProps = {
  children: ReactNode;
  size?: 32 | 36 | 44;
  background?: string;
  style?: ViewStyle;
};

const radii = { 32: radius.sm, 36: radius.tile, 44: radius.md } as const;

export const IconTile = memo<IconTileProps>(({ children, size = 32, background = light.bg, style }) => (
  <View style={[styles.tile, { width: size, height: size, borderRadius: radii[size], backgroundColor: background }, style]}>
    {children}
  </View>
));

IconTile.displayName = 'IconTile';

const styles = StyleSheet.create({
  tile: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
