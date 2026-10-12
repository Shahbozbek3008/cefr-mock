import { memo } from 'react';
import { Pressable, View } from 'react-native';
import { Pencil } from 'lucide-react-native';
import { useI18n } from '@/shared/i18n';
import { makeStyles, radius, space, useTheme } from '@/shared/theme';
import { Avatar, Button, Card, Tag, Text } from '@/shared/ui';

const BADGE = 22;

export type ProfileCardProps = {
  name: string;
  avatarUrl: string | null;
  contact: string;
  monoContact: boolean;
  isPro: boolean;
  onEdit: () => void;
  onUpgrade: () => void;
};

export const ProfileCard = memo<ProfileCardProps>(
  ({ name, avatarUrl, contact, monoContact, isPro, onEdit, onUpgrade }) => {
    const styles = useStyles();
    const { colors } = useTheme();
    const { t } = useI18n();

    return (
      <Card level="raised" radius={radius.cardLg} style={styles.card}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('profileEdit.title')}
          onPress={onEdit}
          style={({ pressed }) => [styles.identity, pressed && styles.pressed]}
        >
          <View>
            <Avatar name={name || '?'} uri={avatarUrl} size={56} />
            <View style={styles.badge}>
              <Pencil size={11} color={colors.textStrong} strokeWidth={2} />
            </View>
          </View>
          <View style={styles.body}>
            <Text variant="heading" numberOfLines={1}>
              {name}
            </Text>
            <Text variant={monoContact ? 'monoSm' : 'caption'} color={colors.textSecondary} numberOfLines={1}>
              {contact}
            </Text>
          </View>
        </Pressable>
        {isPro ? (
          <Tag label="Pro" tone="pro" size="md" />
        ) : (
          <Button label={t('profile.upgrade')} variant="soft" size="S" onPress={onUpgrade} />
        )}
      </Card>
    );
  },
);

ProfileCard.displayName = 'ProfileCard';

const useStyles = makeStyles(({ colors }) => ({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
    padding: space[4],
  },
  identity: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3.5],
  },
  pressed: {
    opacity: 0.7,
  },
  badge: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: BADGE,
    height: BADGE,
    borderRadius: BADGE / 2,
    borderWidth: 2,
    borderColor: colors.surface,
    backgroundColor: colors.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
    gap: space[0.5],
  },
}));
