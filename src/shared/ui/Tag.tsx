import { ReactNode, memo } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { light, radius, space, TypeToken } from '../theme';
import { HeroSurface } from './HeroSurface';
import { Text } from './Text';

export type TagTone = 'lime' | 'neutral' | 'muted' | 'success' | 'warning' | 'error' | 'pro';

export type TagProps = {
  label: string;
  tone?: TagTone;
  size?: 'sm' | 'md';
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
  const height = size === 'sm' ? 22 : 24;
  const variant: TypeToken = mono ? (size === 'sm' ? 'monoXs' : 'monoSmMedium') : size === 'sm' ? 'microMedium' : 'captionMedium';
  const shape = [styles.tag, { height, borderRadius: size === 'sm' ? radius.chip : radius.tag }, style];

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
    paddingHorizontal: space[2],
  },
});
