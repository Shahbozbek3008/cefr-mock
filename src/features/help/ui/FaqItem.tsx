import { memo, useState } from 'react';
import { Pressable, View } from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import { makeStyles, space, useTheme } from '@/shared/theme';
import { Text } from '@/shared/ui';

export type FaqItemProps = {
  question: string;
  answer: string;
  divider?: boolean;
};

export const FaqItem = memo<FaqItemProps>(({ question, answer, divider = false }) => {
  const styles = useStyles();
  const { colors } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <View style={divider && styles.divider}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        onPress={() => setOpen((value) => !value)}
        style={({ pressed }) => [styles.header, pressed && styles.pressed]}
      >
        <Text variant="labelMedium" style={styles.question}>
          {question}
        </Text>
        <ChevronDown
          size={16}
          color={colors.textTertiary}
          strokeWidth={1.75}
          style={open ? styles.chevronOpen : undefined}
        />
      </Pressable>
      {open ? (
        <Text variant="bodySmRelaxed" color={colors.textSecondary} style={styles.answer}>
          {answer}
        </Text>
      ) : null}
    </View>
  );
});

FaqItem.displayName = 'FaqItem';

const useStyles = makeStyles(({ colors }) => ({
  header: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
    paddingVertical: space[3],
  },
  question: {
    flex: 1,
  },
  answer: {
    paddingBottom: space[4],
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  chevronOpen: {
    transform: [{ rotate: '180deg' }],
  },
  pressed: {
    opacity: 0.6,
  },
}));
