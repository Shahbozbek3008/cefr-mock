import { ReactNode, memo } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { makeStyles, size, space, useTheme } from '@/shared/theme';

export type SessionFooterProps = {
  children: ReactNode;
  tone?: 'glass' | 'solid';
};

export const SessionFooter = memo<SessionFooterProps>(({ children, tone = 'glass' }) => {
  const styles = useStyles();
  const { scheme } = useTheme();
  const insets = useSafeAreaInsets();
  const glass = tone === 'glass';

  return (
    <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, space[3]) }, !glass && styles.solid]}>
      {glass && Platform.OS === 'ios' ? (
        <BlurView intensity={40} tint={scheme} style={StyleSheet.absoluteFill} />
      ) : null}
      {glass ? <View style={[StyleSheet.absoluteFill, styles.glass]} /> : null}
      {children}
    </View>
  );
});

SessionFooter.displayName = 'SessionFooter';

const useStyles = makeStyles(({ colors }) => ({
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: space[3],
    paddingHorizontal: size.screenPadding,
    gap: space[3],
    borderTopWidth: 1,
    borderTopColor: colors.hairline,
  },
  glass: {
    backgroundColor: colors.glassDense,
  },
  solid: {
    backgroundColor: colors.surface,
    borderTopColor: colors.divider,
  },
}));
