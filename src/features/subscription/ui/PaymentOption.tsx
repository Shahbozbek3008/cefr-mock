import { memo } from 'react';
import { Image, Pressable } from 'react-native';
import { PaymeLogo } from '@/shared/icons';
import { makeStyles, radius, size, space, useTheme } from '@/shared/theme';
import type { PaymentMethod } from '../model/plans';

const clickLogo = require('../../../../assets/brands/click.png');

export type PaymentOptionProps = {
  id: PaymentMethod;
  title: string;
  selected: boolean;
  onSelect: (id: PaymentMethod) => void;
};

export const PaymentOption = memo<PaymentOptionProps>(({ id, title, selected, onSelect }) => {
  const styles = useStyles();
  const { colors } = useTheme();

  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={title}
      onPress={() => onSelect(id)}
      style={[styles.option, selected ? styles.selected : styles.idle]}
    >
      {id === 'click' ? (
        <Image source={clickLogo} style={styles.clickLogo} />
      ) : (
        <PaymeLogo height={20} color={colors.text} />
      )}
    </Pressable>
  );
});

PaymentOption.displayName = 'PaymentOption';

const useStyles = makeStyles(({ colors }) => ({
  option: {
    flex: 1,
    height: size.buttonM,
    borderRadius: radius.button,
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2.5],
    paddingHorizontal: space[3.5],
  },
  idle: {
    borderWidth: 1,
    borderColor: colors.border,
  },
  selected: {
    borderWidth: 1.5,
    borderColor: colors.selectedBorder,
  },
  clickLogo: {
    width: 32,
    height: 32,
  },
}));
