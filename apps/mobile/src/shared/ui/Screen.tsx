import { ReactNode, memo } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { size, useTheme } from '../theme';

export type ScreenProps = {
  children: ReactNode;
  paddingHorizontal?: number;
  background?: string;
  style?: ViewStyle;
};

export const Screen = memo<ScreenProps>(({ children, paddingHorizontal = size.screenPadding, background, style }) => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.screen,
        { paddingTop: insets.top + size.topGap, paddingHorizontal, backgroundColor: background ?? colors.bg },
        style,
      ]}
    >
      {children}
    </View>
  );
});

Screen.displayName = 'Screen';

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});
