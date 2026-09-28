import { memo } from 'react';
import { Pressable, View } from 'react-native';
import { Camera, Image as ImageIcon, Trash } from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';
import { useI18n } from '@/shared/i18n';
import { makeStyles, radius, space, useTheme } from '@/shared/theme';
import { Sheet, Text } from '@/shared/ui';
import type { AvatarSource } from '../model/pickAvatar';

export type PhotoSheetProps = {
  visible: boolean;
  hasPhoto: boolean;
  onPick: (source: AvatarSource) => void;
  onRemove: () => void;
  onClose: () => void;
  onHidden?: () => void;
};

type OptionProps = {
  icon: LucideIcon;
  label: string;
  destructive?: boolean;
  divider?: boolean;
  onPress: () => void;
};

const Option = ({ icon: Icon, label, destructive = false, divider = false, onPress }: OptionProps) => {
  const styles = useStyles();
  const { colors } = useTheme();
  const tone = destructive ? colors.error.text : colors.textStrong;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.option, divider && styles.divider, pressed && styles.pressed]}
    >
      <View style={[styles.icon, destructive && styles.iconDestructive]}>
        <Icon size={18} color={tone} strokeWidth={1.7} />
      </View>
      <Text variant="label" color={destructive ? colors.error.text : colors.text}>
        {label}
      </Text>
    </Pressable>
  );
};

export const PhotoSheet = memo<PhotoSheetProps>(({ visible, hasPhoto, onPick, onRemove, onClose, onHidden }) => {
  const styles = useStyles();
  const { colors } = useTheme();
  const { t } = useI18n();

  return (
    <Sheet visible={visible} onClose={onClose} onHidden={onHidden}>
      <View style={styles.intro}>
        <Text variant="titleSheet">{t('profileEdit.photoTitle')}</Text>
        <Text variant="labelRelaxed" color={colors.textSecondary}>
          {t('profileEdit.photoSubtitle')}
        </Text>
      </View>
      <View style={styles.group}>
        <Option icon={ImageIcon} label={t('profileEdit.fromLibrary')} onPress={() => onPick('library')} />
        <Option icon={Camera} label={t('profileEdit.fromCamera')} divider onPress={() => onPick('camera')} />
        {hasPhoto ? (
          <Option icon={Trash} label={t('profileEdit.removePhoto')} destructive divider onPress={onRemove} />
        ) : null}
      </View>
    </Sheet>
  );
});

PhotoSheet.displayName = 'PhotoSheet';

const useStyles = makeStyles(({ colors }) => ({
  intro: {
    gap: space[2],
    paddingHorizontal: space[1],
  },
  group: {
    borderRadius: radius.lg,
    backgroundColor: colors.bg,
    overflow: 'hidden',
  },
  option: {
    height: 58,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
    paddingHorizontal: space[4],
  },
  divider: {
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  pressed: {
    backgroundColor: colors.surfaceMuted,
  },
  icon: {
    width: 34,
    height: 34,
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconDestructive: {
    backgroundColor: colors.error.bg,
  },
}));
