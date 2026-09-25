import { memo } from 'react';
import { View } from 'react-native';
import { Bell, Check } from 'lucide-react-native';
import { useI18n } from '@/shared/i18n';
import { makeStyles, radius, space, useTheme } from '@/shared/theme';
import { Button, Text } from '@/shared/ui';

const ART = 148;
const DISC = 108;

export type NotificationsEmptyProps = {
  onEnable?: () => void;
};

export const NotificationsEmpty = memo<NotificationsEmptyProps>(({ onEnable }) => {
  const styles = useStyles();
  const { colors, elevation } = useTheme();
  const { t } = useI18n();

  return (
    <View style={styles.root}>
      <View style={styles.art}>
        <View style={styles.halo} />
        <View style={[styles.disc, elevation.card]}>
          <View style={styles.tile}>
            <Bell size={28} color={colors.selectedText} strokeWidth={1.6} />
          </View>
        </View>
        <View style={styles.badge}>
          <Check size={12} color={colors.onAction} strokeWidth={3} />
        </View>
        <View style={[styles.spark, styles.sparkLarge]} />
        <View style={[styles.spark, styles.sparkSmall]} />
        <View style={[styles.spark, styles.sparkTiny]} />
      </View>

      <View style={styles.copy}>
        <Text variant="titleMd" style={styles.center}>
          {t('notifications.emptyTitle')}
        </Text>
        <Text variant="bodySmRelaxed" color={colors.textSecondary} style={styles.center}>
          {t('notifications.emptyMessage')}
        </Text>
      </View>

      {onEnable ? <Button label={t('notifications.emptyAction')} variant="soft" size="S" onPress={onEnable} /> : null}
    </View>
  );
});

NotificationsEmpty.displayName = 'NotificationsEmpty';

const useStyles = makeStyles(({ colors }) => ({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: space[6],
    paddingHorizontal: space[6],
    paddingBottom: space[12],
  },
  art: {
    width: ART,
    height: ART,
    alignItems: 'center',
    justifyContent: 'center',
  },
  halo: {
    position: 'absolute',
    width: ART,
    height: ART,
    borderRadius: ART / 2,
    backgroundColor: colors.surfaceSubtle,
    opacity: 0.6,
  },
  disc: {
    width: DISC,
    height: DISC,
    borderRadius: DISC / 2,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tile: {
    width: 64,
    height: 64,
    borderRadius: radius.xl,
    backgroundColor: colors.selectedBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: 30,
    right: 30,
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 3,
    borderColor: colors.bg,
    backgroundColor: colors.action,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spark: {
    position: 'absolute',
    backgroundColor: colors.dataSoft,
  },
  sparkLarge: {
    left: 8,
    top: 34,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  sparkSmall: {
    right: 6,
    bottom: 38,
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  sparkTiny: {
    left: 30,
    bottom: 14,
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  copy: {
    gap: space[2],
    maxWidth: 300,
  },
  center: {
    textAlign: 'center',
  },
}));
