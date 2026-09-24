import { ReactNode, memo } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { size, space } from '../theme';

export type TopBarProps = {
  left?: ReactNode;
  center?: ReactNode;
  right?: ReactNode;
  centered?: boolean;
  style?: ViewStyle;
};

export const TopBar = memo<TopBarProps>(({ left, center, right, centered = false, style }) => (
  <View style={[styles.bar, style]}>
    {left ? <View style={styles.side}>{left}</View> : null}
    <View style={[styles.center, centered && styles.centered]}>{center}</View>
    {right !== undefined ? (
      <View style={[styles.side, centered && styles.sideFixed]}>{right}</View>
    ) : null}
  </View>
));

TopBar.displayName = 'TopBar';

const styles = StyleSheet.create({
  bar: {
    height: size.headerBar,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
  },
  side: {
    justifyContent: 'center',
  },
  sideFixed: {
    width: size.iconButton,
    alignItems: 'flex-end',
  },
  center: {
    flex: 1,
  },
  centered: {
    alignItems: 'center',
  },
});
