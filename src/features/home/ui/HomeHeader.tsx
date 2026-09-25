import { memo } from 'react';
import { View } from 'react-native';
import { Bell } from 'lucide-react-native';
import { formatLongDate } from '@/shared/lib';
import { makeStyles, space, useTheme } from '@/shared/theme';
import { Avatar, IconButton, Text } from '@/shared/ui';

export type HomeHeaderProps = {
  name: string;
  hasNotifications: boolean;
  onBellPress: () => void;
};

export const HomeHeader = memo<HomeHeaderProps>(({ name, hasNotifications, onBellPress }) => {
  const styles = useStyles();
  const { colors, elevation } = useTheme();

  return (
    <View style={styles.row}>
      <Avatar name={name} />
      <View style={styles.text}>
        <Text variant="caption" color={colors.textSecondary}>
          {formatLongDate(new Date())}
        </Text>
        <Text variant="titleBadge">{`Salom, ${name}`}</Text>
      </View>
      <IconButton accessibilityLabel="Bildirishnomalar" onPress={onBellPress} style={elevation.segment}>
        <Bell size={19} color={colors.textStrong} strokeWidth={1.5} />
        {hasNotifications ? <View style={styles.badge} /> : null}
      </IconButton>
    </View>
  );
});

HomeHeader.displayName = 'HomeHeader';

const useStyles = makeStyles(({ colors }) => ({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
    paddingHorizontal: space[1],
  },
  text: {
    flex: 1,
  },
  badge: {
    position: 'absolute',
    top: 7,
    right: 8,
    width: 11,
    height: 11,
    borderRadius: 5.5,
    backgroundColor: colors.streak,
    borderWidth: 2,
    borderColor: colors.surface,
  },
}));
