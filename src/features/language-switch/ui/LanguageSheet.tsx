import { memo, useCallback, useRef } from 'react';
import { Pressable, View } from 'react-native';
import { locales, useI18n, useLocaleStore } from '@/shared/i18n';
import type { Locale } from '@/shared/i18n';
import { makeStyles, radius, space, useTheme } from '@/shared/theme';
import { Radio, Sheet, Text } from '@/shared/ui';

export type LanguageSheetProps = {
  visible: boolean;
  onClose: () => void;
};

export const LanguageSheet = memo<LanguageSheetProps>(({ visible, onClose }) => {
  const styles = useStyles();
  const { colors } = useTheme();
  const { t, locale } = useI18n();
  const setLocale = useLocaleStore((s) => s.setLocale);
  const pending = useRef<Locale | null>(null);

  const select = useCallback(
    (value: Locale) => {
      pending.current = value === locale ? null : value;
      onClose();
    },
    [locale, onClose],
  );

  const onHidden = useCallback(() => {
    const next = pending.current;
    pending.current = null;
    if (next) setLocale(next);
  }, [setLocale]);

  return (
    <Sheet visible={visible} onClose={onClose} onHidden={onHidden}>
      <View style={styles.intro}>
        <Text variant="titleSheet">{t('language.title')}</Text>
        <Text variant="labelRelaxed" color={colors.textSecondary}>
          {t('language.subtitle')}
        </Text>
      </View>

      <View style={styles.options}>
        {locales.map((option) => {
          const selected = option.value === locale;
          return (
            <Pressable
              key={option.value}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              accessibilityLabel={option.label}
              onPress={() => select(option.value)}
              style={[styles.option, selected && styles.optionSelected]}
            >
              <Text variant={selected ? 'bodySmMedium' : 'bodySm'} style={styles.label}>
                {option.label}
              </Text>
              <Radio selected={selected} />
            </Pressable>
          );
        })}
      </View>
    </Sheet>
  );
});

LanguageSheet.displayName = 'LanguageSheet';

const useStyles = makeStyles(({ colors }) => ({
  intro: {
    gap: space[2],
    paddingHorizontal: space[1],
  },
  options: {
    gap: space[2],
  },
  option: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
    paddingHorizontal: space[4],
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  optionSelected: {
    borderColor: colors.selectedBorder,
  },
  label: {
    flex: 1,
  },
}));
