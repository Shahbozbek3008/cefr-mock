import { memo } from 'react';
import { StyleSheet } from 'react-native';
import { light } from '../theme';
import { HeroSurface } from './HeroSurface';
import { Text } from './Text';

export type AvatarProps = {
  name: string;
  size?: 40 | 56;
};

export const Avatar = memo<AvatarProps>(({ name, size = 40 }) => (
  <HeroSurface
    colors={light.avatar}
    style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }]}
  >
    <Text variant={size === 56 ? 'titleMd' : 'labelMedium'} color={light.selectedText}>
      {name.trim().charAt(0).toUpperCase()}
    </Text>
  </HeroSurface>
));

Avatar.displayName = 'Avatar';

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
