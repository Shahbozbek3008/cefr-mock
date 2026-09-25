import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { light, space } from '@/shared/theme';
import { Text } from '@/shared/ui';

export type InstructionBlockProps = {
  range: string;
  instruction: string;
  emphasis?: string;
};

export const InstructionBlock = memo<InstructionBlockProps>(({ range, instruction, emphasis }) => (
  <View style={styles.block}>
    <Text variant="monoLabel" color={light.textTertiary}>
      {`QUESTIONS ${range}`}
    </Text>
    <Text variant="body">
      {instruction}
      {emphasis ? (
        <>
          {' '}
          <Text variant="bodyMedium">{emphasis}</Text> for each answer.
        </>
      ) : null}
    </Text>
  </View>
));

InstructionBlock.displayName = 'InstructionBlock';

const styles = StyleSheet.create({
  block: {
    gap: space[1.5],
    paddingTop: space[1.5],
    paddingHorizontal: space[1],
  },
});
