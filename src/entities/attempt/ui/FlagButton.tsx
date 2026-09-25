import { memo } from 'react';
import { StyleSheet } from 'react-native';
import { Flag } from 'lucide-react-native';
import { useAttemptStore, useIsFlagged } from '../model/store';
import { light } from '@/shared/theme';
import { IconButton } from '@/shared/ui';

export const FlagButton = memo<{ questionId: string }>(({ questionId }) => {
  const flagged = useIsFlagged(questionId);
  const toggleFlag = useAttemptStore((s) => s.toggleFlag);

  return (
    <IconButton
      accessibilityLabel={flagged ? 'Belgini olib tashlash' : 'Savolni belgilash'}
      shape="square"
      tone="outline"
      onPress={() => toggleFlag(questionId)}
      style={flagged ? styles.flagged : undefined}
    >
      <Flag
        size={18}
        color={flagged ? light.warning.text : light.textStrong}
        fill={flagged ? light.warning[500] : 'transparent'}
        strokeWidth={1.6}
      />
    </IconButton>
  );
});

FlagButton.displayName = 'FlagButton';

const styles = StyleSheet.create({
  flagged: {
    backgroundColor: light.warning.bg,
    borderColor: light.warning.border,
  },
});
