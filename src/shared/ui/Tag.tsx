import { ReactNode, memo } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { light, radius, space, TypeToken } from '../theme';
import { HeroSurface } from './HeroSurface';
import { Text } from './Text';

export type TagTone = 'lime' | 'neutral' | 'muted' | 'success' | 'warning' | 'error' | 'pro';

type TagSize = 'xs' | 'sm' | 'md';

const metrics: Record<TagSize, { height: number; radius: number; padding: number; text: TypeToken; mono: TypeToken }> = {
  xs: { height: 20, radius: radius.xs, padding: 7, text: 'nanoMedium', mono: 'monoNano' },
  sm: { height: 22, radius: radius.chip, padding: space[2], text: 'microMedium', mono: 'monoXs' },
  md: { height: 24, radius: radius.tag, padding: space[2], text: 'captionMedium', mono: 'monoSmMedium' },
};

export type TagProps = {
  label: string;
  tone?: TagTone;
  size?: TagSize;
  mono?: boolean;
  icon?: ReactNode;
  style?: ViewStyle;
};

const tones: Record<Exclude<TagTone, 'pro'>, { bg: string; fg: string }> = {
  lime: { bg: light.chipActiveBg, fg: light.selectedText },
  neutral: { bg: light.surfaceMuted, fg: light.textSecondary },
  muted: { bg: light.bg, fg: light.textSecondary },
  success: { bg: light.success.bg, fg: light.success.text },
  warning: { bg: light.warning.bg, fg: light.warning.text },
  error: { bg: light.error.bg, fg: light.error.text },
};

export const Tag = memo<TagProps>(({ label, tone = 'neutral', size = 'sm', mono = false, icon, style }) => {
  const m = metrics[size];
  const variant = mono ? m.mono : m.text;
  const shape = [styles.tag, { height: m.height, borderRadius: m.radius, paddingHorizontal: m.padding }, style];

  if (tone === 'pro') {
    return (
      <HeroSurface style={shape}>
        <Text variant={variant} color={light.onHero}>
          {label}
        </Text>
      </HeroSurface>
    );
  }

  const t = tones[tone];

  return (
    <View style={[shape, { backgroundColor: t.bg }]}>
      {icon}
      <Text variant={variant} color={t.fg}>
        {label}
      </Text>
    </View>
  );
});

Tag.displayName = 'Tag';

const styles = StyleSheet.create({
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: space[1],
  },
});
