import { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { font, light, palette, radius, size, space } from '@/shared/theme';
import { Text } from '@/shared/ui';
import type { PaymentMethod } from '../model/plans';

export type PaymentOptionProps = {
  id: PaymentMethod;
  title: string;
  letter: string;
  selected: boolean;
  onSelect: (id: PaymentMethod) => void;
};

export const PaymentOption = memo<PaymentOptionProps>(({ id, title, letter, selected, onSelect }) => (
  <Pressable
    accessibilityRole="radio"
    accessibilityState={{ selected }}
    accessibilityLabel={title}
    onPress={() => onSelect(id)}
    style={[styles.option, selected ? styles.selected : styles.idle]}
  >
    <View style={[styles.logo, { backgroundColor: palette.brand[id] }]}>
      <Text variant="microMedium" color={palette.neutral.white} style={styles.letter}>
        {letter}
      </Text>
    </View>
    <Text variant="labelMedium">{title}</Text>
  </Pressable>
));

PaymentOption.displayName = 'PaymentOption';

const styles = StyleSheet.create({
  option: {
    flex: 1,
    height: size.buttonM,
    borderRadius: radius.button,
    backgroundColor: light.surface,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2.5],
    paddingHorizontal: space[3.5],
  },
  idle: {
    borderWidth: 1,
    borderColor: light.border,
  },
  selected: {
    borderWidth: 1.5,
    borderColor: light.selectedBorder,
  },
  logo: {
    width: 28,
    height: 28,
    borderRadius: radius.tag,
    alignItems: 'center',
    justifyContent: 'center',
  },
  letter: {
    fontFamily: font.semibold,
  },
});
