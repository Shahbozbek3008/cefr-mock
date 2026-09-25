import { memo, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Check } from 'lucide-react-native';
import { useAttemptStore } from '@/entities/attempt';
import { light, space } from '@/shared/theme';
import { Text } from '@/shared/ui';
import { savedLabel } from './draft';

const REFRESH_MS = 5000;

export const SavedNote = memo(() => {
  const savedAt = useAttemptStore((s) => s.writingSavedAt);
  const [now, setNow] = useState(Date.now);

  useEffect(() => {
    setNow(Date.now());
    const interval = setInterval(() => setNow(Date.now()), REFRESH_MS);
    return () => clearInterval(interval);
  }, [savedAt]);

  return (
    <View style={styles.row}>
      <Check size={14} color={light.textSecondary} strokeWidth={2} />
      <Text variant="caption" color={light.textSecondary}>
        {savedLabel(savedAt, now)}
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
