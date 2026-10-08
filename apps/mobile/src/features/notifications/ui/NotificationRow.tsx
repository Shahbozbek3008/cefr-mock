import { memo } from 'react';
import { Pressable, View } from 'react-native';
import type { AppNotification } from '@/entities/notification';
import { useI18n } from '@/shared/i18n';
import { makeStyles, radius, space, useTheme } from '@/shared/theme';
import { Text } from '@/shared/ui';
import { clockOf, groupOf } from '../model/group';
import { kindStyles } from './kindStyles';

export type NotificationRowProps = {
  item: AppNotification;
  divider?: boolean;
  onPress: (item: AppNotification) => void;
};

export const NotificationRow = memo<NotificationRowProps>(({ item, divider, onPress }) => {
  const styles = useStyles();
  const { colors } = useTheme();
  const { t, dayMonth } = useI18n();
  const { icon: Icon, tone } = kindStyles[item.kind];
  const { bg, fg } = tone(colors);
  const title = t(`notifications.kinds.${item.kind}.title`, item.params);
  const body = t(`notifications.kinds.${item.kind}.body`, item.params);
  const time = groupOf(item.createdAt, new Date()) === 'earlier' ? dayMonth(item.createdAt) : clockOf(item.createdAt);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${title}. ${body}`}
      onPress={() => onPress(item)}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <View style={[styles.icon, { backgroundColor: bg }]}>
        <Icon size={18} color={fg} strokeWidth={1.7} />
      </View>

      <View style={[styles.body, divider && styles.divider]}>
        <View style={styles.line}>
          <Text variant={item.read ? 'bodySm' : 'bodySmMedium'} numberOfLines={1} style={styles.fill}>
            {title}
          </Text>
          <Text variant="monoXs" color={colors.textTertiary}>
            {time}
          </Text>
        </View>
        <View style={styles.line}>
          <Text variant="callout" color={colors.textSecondary} numberOfLines={2} style={styles.fill}>
            {body}
          </Text>
          <View style={[styles.dot, !item.read && styles.dotUnread]} />
        </View>
      </View>
    </Pressable>
  );
});

NotificationRow.displayName = 'NotificationRow';

const useStyles = makeStyles(({ colors }) => ({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: space[3],
    paddingLeft: space[4],
    backgroundColor: colors.surface,
  },
  pressed: {
    backgroundColor: colors.surfaceMuted,
  },
  icon: {
    width: 40,
    height: 40,
    marginTop: space[3.5],
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
    gap: space[1],
    paddingVertical: space[3.5],
    paddingRight: space[4],
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  line: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: space[3],
  },
  fill: {
    flex: 1,
  },
  dot: {
    width: 8,
    height: 8,
    marginTop: 5,
    borderRadius: 4,
  },
  dotUnread: {
    backgroundColor: colors.data,
  },
}));
