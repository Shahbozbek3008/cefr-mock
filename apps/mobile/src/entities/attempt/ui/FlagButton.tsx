import { memo } from 'react';

import { Flag } from 'lucide-react-native';
import { useI18n } from '@/shared/i18n';
import { useAttemptStore, useIsFlagged } from '../model/store';
import { makeStyles, useTheme } from '@/shared/theme';
import { IconButton } from '@/shared/ui';

export const FlagButton = memo<{ questionId: string }>(({ questionId }) => {
  const styles = useStyles();
  const { colors } = useTheme();
  const { t } = useI18n();
  const flagged = useIsFlagged(questionId);
  const toggleFlag = useAttemptStore((s) => s.toggleFlag);

  return (
    <IconButton
      accessibilityLabel={flagged ? t('session.unflag') : t('session.flag')}
      shape="square"
      tone="outline"
      onPress={() => toggleFlag(questionId)}
      style={flagged ? styles.flagged : undefined}
    >
      <Flag
        size={18}
        color={flagged ? colors.warning.text : colors.textStrong}
        fill={flagged ? colors.warning[500] : 'transparent'}
        strokeWidth={1.6}
      />
    </IconButton>
  );
});

FlagButton.displayName = 'FlagButton';

const useStyles = makeStyles(({ colors }) => ({
  flagged: {
    backgroundColor: colors.warning.bg,
    borderColor: colors.warning.border,
  },
}));
