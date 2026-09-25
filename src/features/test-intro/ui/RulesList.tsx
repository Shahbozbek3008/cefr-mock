import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Headphones, LucideIcon, Wifi } from 'lucide-react-native';
import { useI18n } from '@/shared/i18n';
import type { TKey } from '@/shared/i18n';
import { space, useTheme } from '@/shared/theme';
import { Text } from '@/shared/ui';

const rules: { Icon: LucideIcon; text: TKey }[] = [
  { Icon: Headphones, text: 'testIntro.ruleAudio' },
  { Icon: Wifi, text: 'testIntro.ruleOffline' },
];

export const RulesList = memo(() => {
  const { colors } = useTheme();
  const { t } = useI18n();

  return (
    <View style={styles.list}>
      <Text variant="calloutMedium">{t('testIntro.rules')}</Text>
      {rules.map(({ Icon, text }) => (
        <View key={text} style={styles.rule}>
          <Icon size={15} color={colors.data} strokeWidth={1.6} style={styles.icon} />
          <Text variant="callout" color={colors.textStrong} style={styles.text}>
            {t(text)}
          </Text>
        </View>
      ))}
    </View>
  );
});

RulesList.displayName = 'RulesList';

const styles = StyleSheet.create({
  list: {
    gap: space[2.5],
    paddingHorizontal: space[1],
  },
  rule: {
    flexDirection: 'row',
    gap: space[2.5],
  },
  icon: {
    marginTop: 1,
  },
  text: {
    flex: 1,
  },
});
