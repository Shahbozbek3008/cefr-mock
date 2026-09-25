import { memo } from 'react';
import { Pressable, View } from 'react-native';
import { hitSlop, makeStyles, radius, space, useTheme } from '../theme';
import { Text } from './Text';

export type StateViewProps = {
  tone?: 'empty' | 'error';
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
};

export const StateView = memo<StateViewProps>(({ tone = 'empty', title, message, actionLabel, onAction }) => {
  const styles = useStyles();
  const { colors } = useTheme();

  return (
    <View style={[styles.box, tone === 'error' ? styles.error : styles.empty]}>
      <Text variant="calloutMedium" color={tone === 'error' ? colors.error.text : colors.text}>
        {title}
      </Text>
      <Text variant="micro" color={colors.textSecondary}>
        {message}
      </Text>
      {actionLabel ? (
        <Pressable accessibilityRole="button" hitSlop={hitSlop} onPress={onAction} style={styles.action}>
          <Text variant="captionMedium" color={colors.link}>
            {actionLabel}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
});

StateView.displayName = 'StateView';

const useStyles = makeStyles(({ colors }) => ({
  box: {
    borderRadius: radius.md,
    padding: space[3],
    gap: space[1],
  },
  empty: {
    backgroundColor: colors.bg,
  },
  error: {
    backgroundColor: colors.error.bg,
  },
  action: {
    marginTop: space[1],
    alignSelf: 'flex-start',
  },
}));
