import { memo, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Check } from 'lucide-react-native';
import { useAttemptStore } from '@/entities/attempt';
import { useI18n } from '@/shared/i18n';
import { space, useTheme } from '@/shared/theme';
import { Text } from '@/shared/ui';
import { savedStatus } from './draft';

const REFRESH_MS = 5000;

export const SavedNote = memo(() => {
  const { colors } = useTheme();
  const { t } = useI18n();
  const savedAt = useAttemptStore((s) => s.writingSavedAt);
  const [now, setNow] = useState(Date.now);

  useEffect(() => {
    setNow(Date.now());
    const interval = setInterval(() => setNow(Date.now()), REFRESH_MS);
    return () => clearInterval(interval);
  }, [savedAt]);

  const status = savedStatus(savedAt, now);

  return (
    <View style={styles.row}>
      <Check size={14} color={colors.textSecondary} strokeWidth={2} />
      <Text variant="caption" color={colors.textSecondary}>
        {t(status.key, { count: status.count ?? 0 })}
      </Text>
    </View>
  );
});

SavedNote.displayName = 'SavedNote';

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2],
    paddingHorizontal: space[1],
  },
});
