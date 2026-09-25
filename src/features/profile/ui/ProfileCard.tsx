import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { light, radius, space } from '@/shared/theme';
import { Avatar, Button, Card, Tag, Text } from '@/shared/ui';

export type ProfileCardProps = {
  name: string;
  phone: string;
  isPro: boolean;
  onUpgrade: () => void;
};

export const ProfileCard = memo<ProfileCardProps>(({ name, phone, isPro, onUpgrade }) => (
  <Card level="raised" radius={radius.cardLg} style={styles.card}>
    <Avatar name={name} size={56} />
    <View style={styles.body}>
      <Text variant="heading">{name}</Text>
      <Text variant="monoSm" color={light.textSecondary}>
        {phone}
      </Text>
    </View>
    {isPro ? (
      <Tag label="Pro" tone="pro" size="md" />
    ) : (
      <Button label="Pro olish" variant="soft" size="S" onPress={onUpgrade} />
    )}
  </Card>
));

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
