import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Check } from 'lucide-react-native';
import type { SpeakingReview } from '@/entities/result';
import { font, radius, space, useTheme } from '@/shared/theme';
import { Card, Text } from '@/shared/ui';

export const TipList = memo<{ tips: SpeakingReview['tips'] }>(({ tips }) => {
  const { colors } = useTheme();

  return (
    <View style={styles.list}>
      {tips.map((tip) => {
        const good = tip.tone === 'good';
        return (
          <Card key={tip.text} radius={radius.button} style={styles.tip}>
            <View style={[styles.icon, { backgroundColor: good ? colors.success.bg : colors.warning.bg }]}>
              {good ? (
                <Check size={12} color={colors.success.text} strokeWidth={2.5} />
              ) : (
                <Text variant="caption" color={colors.warning.text} style={styles.bang}>
                  !
                </Text>
              )}
            </View>
            <Text variant="calloutRelaxed" color={colors.textStrong} style={styles.text}>
              {tip.text}
            </Text>
          </Card>
        );
      })}
    </View>
  );
});

TipList.displayName = 'TipList';

const styles = StyleSheet.create({
  list: {
    gap: space[2],
  },
  tip: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: space[2.5],
    paddingVertical: space[3],
    paddingHorizontal: space[3.5],
  },
  icon: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bang: {
    fontFamily: font.semibold,
  },
  text: {
    flex: 1,
  },
});
