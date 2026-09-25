import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { space, useTheme } from '../theme';
import { Button } from './Button';
import { Sheet } from './Sheet';
import { Text } from './Text';

export type ConfirmSheetProps = {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  destructive?: boolean;
  onConfirm: () => void;
  onClose: () => void;
};

export const ConfirmSheet = memo<ConfirmSheetProps>(
  ({ visible, title, message, confirmLabel, cancelLabel, destructive = false, onConfirm, onClose }) => {
    const { colors } = useTheme();

    return (
      <Sheet visible={visible} onClose={onClose}>
        <View style={styles.intro}>
          <Text variant="titleSheet">{title}</Text>
          <Text variant="labelRelaxed" color={colors.textSecondary}>
            {message}
          </Text>
        </View>
        <View style={styles.actions}>
          <Button label={cancelLabel} size="M" onPress={onClose} />
          <Button label={confirmLabel} size="M" variant={destructive ? 'destructive' : 'muted'} onPress={onConfirm} />
        </View>
      </Sheet>
    );
  },
);

ConfirmSheet.displayName = 'ConfirmSheet';

const styles = StyleSheet.create({
  intro: {
    gap: space[2],
    paddingHorizontal: space[1],
  },
  actions: {
    gap: space[2],
  },
});
