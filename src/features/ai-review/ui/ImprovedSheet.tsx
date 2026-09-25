import { memo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { light, space } from '@/shared/theme';
import { Sheet, Text } from '@/shared/ui';

export type ImprovedSheetProps = {
  visible: boolean;
  text: string;
  onClose: () => void;
};

export const ImprovedSheet = memo<ImprovedSheetProps>(({ visible, text, onClose }) => (
  <Sheet visible={visible} onClose={onClose}>
    <View style={styles.intro}>
      <Text variant="titleSheet">Yaxshilangan variant</Text>
      <Text variant="labelRelaxed" color={light.textSecondary}>
        Xatolar tuzatilgan va akademik uslubga moslangan.
      </Text>
    </View>
    <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
      <Text variant="readingSm" color={light.textReading} style={styles.text}>
        {text}
      </Text>
    </ScrollView>
  </Sheet>
));

ImprovedSheet.displayName = 'ImprovedSheet';

const styles = StyleSheet.create({
  intro: {
    gap: space[2],
    paddingHorizontal: space[1],
  },
  scroll: {
    maxHeight: 420,
  },
  text: {
    paddingHorizontal: space[1],
  },
});
