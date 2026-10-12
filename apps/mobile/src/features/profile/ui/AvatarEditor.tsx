import { memo } from 'react';
import { Pressable, View } from 'react-native';
import { Camera } from 'lucide-react-native';
import { useI18n } from '@/shared/i18n';
import { hitSlop, makeStyles, space, useTheme } from '@/shared/theme';
import { Avatar, Text } from '@/shared/ui';

const BADGE = 34;

export type AvatarEditorProps = {
  name: string;
  uri: string | null;
  onPress: () => void;
};

export const AvatarEditor = memo<AvatarEditorProps>(({ name, uri, onPress }) => {
  const styles = useStyles();
  const { colors, elevation } = useTheme();
  const { t } = useI18n();
  const label = t(uri ? 'profileEdit.changePhoto' : 'profileEdit.addPhoto');

  return (
    <View style={styles.root}>
      <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress} style={styles.avatar}>
        <View style={[styles.ring, elevation.card]}>
          <Avatar name={name || '?'} uri={uri} size={96} />
        </View>
        <View style={styles.badge}>
          <Camera size={16} color={colors.onAction} strokeWidth={1.9} />
        </View>
      </Pressable>
      <Pressable accessibilityRole="button" hitSlop={hitSlop} onPress={onPress}>
        <Text variant="calloutMedium" color={colors.link}>
          {label}
        </Text>
      </Pressable>
    </View>
  );
});

AvatarEditor.displayName = 'AvatarEditor';

const useStyles = makeStyles(({ colors }) => ({
  root: {
    alignItems: 'center',
    gap: space[3],
  },
  avatar: {
    width: 104,
    height: 104,
  },
  ring: {
    padding: 4,
    borderRadius: 52,
    backgroundColor: colors.surface,
  },
  badge: {
    position: 'absolute',
    right: 0,
    bottom: 2,
    width: BADGE,
    height: BADGE,
    borderRadius: BADGE / 2,
    borderWidth: 3,
    borderColor: colors.bg,
    backgroundColor: colors.action,
    alignItems: 'center',
    justifyContent: 'center',
  },
}));
