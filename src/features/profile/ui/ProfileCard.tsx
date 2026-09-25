import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useI18n } from '@/shared/i18n';
import { radius, space, useTheme } from '@/shared/theme';
import { Avatar, Button, Card, Tag, Text } from '@/shared/ui';

export type ProfileCardProps = {
  name: string;
  contact: string;
  monoContact: boolean;
  isPro: boolean;
  onUpgrade: () => void;
};

export const ProfileCard = memo<ProfileCardProps>(({ name, contact, monoContact, isPro, onUpgrade }) => {
  const { colors } = useTheme();
  const { t } = useI18n();

  return (
    <Card level="raised" radius={radius.cardLg} style={styles.card}>
      <Avatar name={name} size={56} />
      <View style={styles.body}>
        <Text variant="heading">{name}</Text>
        <Text variant={monoContact ? 'monoSm' : 'caption'} color={colors.textSecondary} numberOfLines={1}>
          {contact}
        </Text>
      </View>
      {isPro ? (
        <Tag label="Pro" tone="pro" size="md" />
      ) : (
        <Button label={t('profile.upgrade')} variant="soft" size="S" onPress={onUpgrade} />
      )}
    </Card>
  );
});

ProfileCard.displayName = 'ProfileCard';

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3.5],
    padding: space[4],
  },
  body: {
    flex: 1,
    gap: space[0.5],
  },
});
