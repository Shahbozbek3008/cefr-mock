import { memo } from 'react';
import { StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { TypeToken, useTheme } from '../theme';
import { HeroSurface } from './HeroSurface';
import { Text } from './Text';

type AvatarSize = 40 | 56 | 96;

export type AvatarProps = {
  name: string;
  uri?: string | null;
  size?: AvatarSize;
};

const initialsVariant: Record<AvatarSize, TypeToken> = {
  40: 'labelMedium',
  56: 'titleMd',
  96: 'titleXl',
};

const initialsOf = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');

export const Avatar = memo<AvatarProps>(({ name, uri, size = 40 }) => {
  const { colors } = useTheme();
  const shape = { width: size, height: size, borderRadius: size / 2 };

  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={[shape, { backgroundColor: colors.skeleton }]}
        contentFit="cover"
        transition={180}
        cachePolicy="memory-disk"
        accessibilityIgnoresInvertColors
      />
    );
  }

  return (
    <HeroSurface colors={colors.avatar} style={[styles.avatar, shape]}>
      <Text variant={initialsVariant[size]} color={colors.selectedText}>
        {initialsOf(name)}
      </Text>
    </HeroSurface>
  );
});

Avatar.displayName = 'Avatar';

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
