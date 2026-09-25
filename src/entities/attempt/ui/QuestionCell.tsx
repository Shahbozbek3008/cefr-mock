import { memo } from 'react';
import { Pressable, View } from 'react-native';
import { useI18n } from '@/shared/i18n';
import { useAnswer, useIsFlagged } from '../model/store';
import { makeStyles, radius, useTheme } from '@/shared/theme';
import { Text } from '@/shared/ui';

export type QuestionCellProps = {
  id: string;
  number: number;
  current: boolean;
  size?: 'sm' | 'md';
  onPress: (id: string) => void;
};

export const QuestionCell = memo<QuestionCellProps>(({ id, number, current, size = 'sm', onPress }) => {
  const styles = useStyles();
  const { colors, elevation } = useTheme();
  const { t } = useI18n();
  const answered = useAnswer(id).trim() !== '';
  const flagged = useIsFlagged(id);
  const color = current ? colors.onAction : answered ? colors.selectedText : colors.textSecondary;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={t('session.question', { number })}
      accessibilityState={{ selected: current }}
      onPress={() => onPress(id)}
      style={[
        size === 'sm' ? styles.sm : styles.md,
        current ? [styles.current, elevation.actionXs] : answered ? styles.answered : styles.empty,
      ]}
    >
      <Text variant={size === 'sm' ? 'monoSm' : 'monoCallout'} color={color}>
        {String(number).padStart(2, '0')}
      </Text>
      {flagged ? <View style={styles.flag} /> : null}
    </Pressable>
  );
});

QuestionCell.displayName = 'QuestionCell';

const useStyles = makeStyles(({ colors }) => ({
  sm: {
    flex: 1,
    height: 34,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  md: {
    width: 40,
    height: 40,
    borderRadius: radius.input,
    alignItems: 'center',
    justifyContent: 'center',
  },
  current: {
    backgroundColor: colors.action,
  },
  answered: {
    backgroundColor: colors.chipActiveBg,
  },
  empty: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  flag: {
    position: 'absolute',
    top: -3,
    right: -3,
    width: 13,
    height: 13,
    borderRadius: 6.5,
    backgroundColor: colors.warning[500],
    borderWidth: 2,
    borderColor: colors.surface,
  },
}));
