import { ReactNode, memo } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { light, palette, size, space } from '@/shared/theme';

export type SessionFooterProps = {
  children: ReactNode;
  tone?: 'glass' | 'solid';
};

export const SessionFooter = memo<SessionFooterProps>(({ children, tone = 'glass' }) => {
  const insets = useSafeAreaInsets();
  const glass = tone === 'glass';

  return (
    <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, space[3]) }, !glass && styles.solid]}>
      {glass && Platform.OS === 'ios' ? <BlurView intensity={40} tint="light" style={StyleSheet.absoluteFill} /> : null}
      {glass ? <View style={[StyleSheet.absoluteFill, styles.glass]} /> : null}
      {children}
    </View>
  );
});

SessionFooter.displayName = 'SessionFooter';

const styles = StyleSheet.create({
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: space[3],
    paddingHorizontal: size.screenPadding,
    gap: space[3],
    borderTopWidth: 1,
    borderTopColor: light.hairline,
  },
  glass: {
    backgroundColor: Platform.OS === 'ios' ? palette.white.a86 : palette.white.a92,
  },
  solid: {
    backgroundColor: light.surface,
    borderTopColor: light.divider,
  },
});
