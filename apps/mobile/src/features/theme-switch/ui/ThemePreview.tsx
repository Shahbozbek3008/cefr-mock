import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { radius, space, themes } from '@/shared/theme';
import type { Scheme, ThemePreference } from '@/shared/theme';

const Mock = memo<{ scheme: Scheme }>(({ scheme }) => {
  const { colors } = themes[scheme];

  return (
    <View style={[styles.mock, { backgroundColor: colors.bg }]}>
      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.hairline }]}>
        <View style={[styles.line, styles.lineWide, { backgroundColor: colors.text }]} />
        <View style={[styles.line, styles.lineShort, { backgroundColor: colors.textTertiary }]} />
      </View>
      <View style={[styles.button, { backgroundColor: colors.action }]} />
    </View>
  );
});

Mock.displayName = 'ThemeMock';

export const ThemePreview = memo<{ preference: ThemePreference }>(({ preference }) =>
  preference === 'system' ? (
    <View>
      <Mock scheme="light" />
      <View style={styles.darkHalf}>
        <View style={styles.darkFull}>
          <Mock scheme="dark" />
        </View>
      </View>
    </View>
  ) : (
    <Mock scheme={preference} />
  ),
);

ThemePreview.displayName = 'ThemePreview';

const PREVIEW_HEIGHT = 96;

const styles = StyleSheet.create({
  mock: {
    height: PREVIEW_HEIGHT,
    borderRadius: radius.md,
    padding: space[2.5],
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  card: {
    borderRadius: radius.tag,
    borderWidth: 1,
    padding: space[2],
    gap: space[1.5],
  },
  line: {
    height: 4,
    borderRadius: 2,
  },
  lineWide: {
    width: '80%',
  },
  lineShort: {
    width: '50%',
  },
  button: {
    height: 14,
    borderRadius: radius.xs,
  },
  darkHalf: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: '50%',
    overflow: 'hidden',
  },
  darkFull: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '200%',
  },
});
