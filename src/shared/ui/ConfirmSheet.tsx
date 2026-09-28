import { memo } from 'react';
import { View } from 'react-native';
import { CircleHelp, TriangleAlert } from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';
import { makeStyles, radius, space, useTheme } from '../theme';
import type { Colors } from '../theme';
import { Button } from './Button';
import { Sheet } from './Sheet';
import { Text } from './Text';

export type ConfirmTone = 'neutral' | 'warning' | 'destructive';

export type ConfirmSheetProps = {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  tone?: ConfirmTone;
  icon?: LucideIcon;
  loading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
};

const defaultIcons: Record<ConfirmTone, LucideIcon> = {
  neutral: CircleHelp,
  warning: TriangleAlert,
  destructive: TriangleAlert,
};

const toneColors = (colors: Colors, tone: ConfirmTone) =>
  ({
    neutral: { bg: colors.selectedBg, fg: colors.selectedText },
    warning: { bg: colors.warning.bg, fg: colors.warning.text },
    destructive: { bg: colors.error.bg, fg: colors.error.text },
  })[tone];

export const ConfirmSheet = memo<ConfirmSheetProps>(
  ({ visible, title, message, confirmLabel, cancelLabel, tone = 'neutral', icon, loading, onConfirm, onClose }) => {
    const styles = useStyles();
    const { colors } = useTheme();
    const Icon = icon ?? defaultIcons[tone];
    const palette = toneColors(colors, tone);

    return (
      <Sheet visible={visible} onClose={onClose}>
        <View style={styles.intro}>
          <View style={[styles.badge, { backgroundColor: palette.bg }]}>
            <Icon size={22} color={palette.fg} strokeWidth={1.8} />
          </View>
          <View style={styles.copy}>
            <Text variant="titleSheet" style={styles.center}>
              {title}
            </Text>
            <Text variant="labelRelaxed" color={colors.textSecondary} style={styles.center}>
              {message}
            </Text>
          </View>
        </View>

        <View style={styles.actions}>
          <Button label={cancelLabel} variant="secondary" size="M" align="center" grow onPress={onClose} />
          <Button
            label={confirmLabel}
            variant={tone === 'destructive' ? 'destructive' : 'primary'}
            size="M"
            align="center"
            grow
            loading={loading}
            onPress={onConfirm}
          />
        </View>
      </Sheet>
    );
  },
);

ConfirmSheet.displayName = 'ConfirmSheet';

const BADGE = 52;

const useStyles = makeStyles(() => ({
  intro: {
    alignItems: 'center',
    gap: space[4],
    paddingTop: space[1],
    paddingHorizontal: space[2],
  },
  badge: {
    width: BADGE,
    height: BADGE,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: {
    gap: space[2],
  },
  center: {
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    gap: space[2.5],
  },
}));
