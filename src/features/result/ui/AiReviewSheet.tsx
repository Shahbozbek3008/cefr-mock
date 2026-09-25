import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Mic, PenLine } from 'lucide-react-native';
import { light, space } from '@/shared/theme';
import { ListGroup, ListRow, Sheet, Text } from '@/shared/ui';

export type AiReviewSheetProps = {
  visible: boolean;
  onWriting: () => void;
  onSpeaking: () => void;
  onClose: () => void;
};

const ICON = { size: 16, color: light.textStrong, strokeWidth: 1.5 } as const;

export const AiReviewSheet = memo<AiReviewSheetProps>(({ visible, onWriting, onSpeaking, onClose }) => (
  <Sheet visible={visible} onClose={onClose}>
    <View style={styles.intro}>
      <Text variant="titleSheet">AI baho</Text>
      <Text variant="labelRelaxed" color={light.textSecondary}>
        Writing va Speaking javoblaringiz mezonlar bo'yicha baholandi.
      </Text>
    </View>
    <ListGroup>
      <ListRow icon={<PenLine {...ICON} />} title="Writing bahosi" divider onPress={onWriting} />
      <ListRow icon={<Mic {...ICON} />} title="Speaking bahosi" onPress={onSpeaking} />
    </ListGroup>
  </Sheet>
));

AiReviewSheet.displayName = 'AiReviewSheet';

const styles = StyleSheet.create({
  intro: {
    gap: space[2],
    paddingHorizontal: space[1],
  },
});
