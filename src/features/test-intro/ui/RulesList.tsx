import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Headphones, LucideIcon, Wifi } from 'lucide-react-native';
import { light, space } from '@/shared/theme';
import { Text } from '@/shared/ui';

const rules: { Icon: LucideIcon; text: string }[] = [
  { Icon: Headphones, text: 'Quloqchin taqing. Audio bir marta, pauzasiz eshittiriladi.' },
  { Icon: Wifi, text: "Javoblar qurilmada ham saqlanadi — internet uzilsa ham yo'qolmaydi." },
];

export const RulesList = memo(() => (
  <View style={styles.list}>
    <Text variant="calloutMedium">Qoidalar</Text>
    {rules.map(({ Icon, text }) => (
      <View key={text} style={styles.rule}>
        <Icon size={15} color={light.data} strokeWidth={1.6} style={styles.icon} />
        <Text variant="callout" color={light.textStrong} style={styles.text}>
          {text}
        </Text>
      </View>
    ))}
  </View>
));

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
