import { ReactNode, memo } from 'react';
import { Pressable, View } from 'react-native';
import { makeStyles, space, useTheme } from '@/shared/theme';
import { IconTile, Text } from '@/shared/ui';

export type ContactRowProps = {
  icon: ReactNode;
  value: string;
  label: string;
  action: ReactNode;
  accessibilityLabel: string;
  onPress: () => void;
};

export const ContactRow = memo<ContactRowProps>(({ icon, value, label, action, accessibilityLabel, onPress }) => {
  const styles = useStyles();
  const { colors } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <IconTile size={36}>{icon}</IconTile>
      <View style={styles.text}>
        <Text variant="labelMedium" numberOfLines={1} style={styles.value}>
          {value}
        </Text>
        <Text variant="caption" color={colors.textSecondary} numberOfLines={1}>
          {label}
        </Text>
      </View>
      <View style={styles.action}>{action}</View>
    </Pressable>
  );
});

ContactRow.displayName = 'ContactRow';

const useStyles = makeStyles(({ colors }) => ({
  row: {
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
    paddingVertical: space[3],
  },
  text: {
    flex: 1,
    minWidth: 0,
    gap: space[0.5],
  },
  value: {
    fontVariant: ['tabular-nums'],
  },
  action: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.action,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.6,
  },
}));
