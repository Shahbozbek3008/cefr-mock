import { memo, useCallback, useEffect, useState } from 'react';
import { GestureResponderEvent, Pressable, View } from 'react-native';
import { useI18n } from '@/shared/i18n';
import { makeStyles, motion, radius, space, useTheme, useThemePreference } from '@/shared/theme';
import type { ThemePreference } from '@/shared/theme';
import { Radio, Sheet, Text } from '@/shared/ui';
import { themeOptions } from '../model/options';
import { ThemePreview } from './ThemePreview';
import { useThemeSwitch } from './ThemeTransitionProvider';

export type ThemeSheetProps = {
  visible: boolean;
  onClose: () => void;
};

type OptionsProps = {
  preference: ThemePreference;
  onSelect: (value: ThemePreference, event: GestureResponderEvent) => void;
};

const ThemeOptions = ({ preference, onSelect }: OptionsProps) => {
  const styles = useStyles();
  const { colors } = useTheme();
  const { t } = useI18n();

  return (
    <>
      <View style={styles.intro}>
        <Text variant="titleSheet">{t('theme.title')}</Text>
        <Text variant="labelRelaxed" color={colors.textSecondary}>
          {t('theme.subtitle')}
        </Text>
      </View>

      <View style={styles.options}>
        {themeOptions.map((option) => {
          const selected = option === preference;
          return (
            <Pressable
              key={option}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              accessibilityLabel={t(`theme.${option}`)}
              onPress={(event) => onSelect(option, event)}
              style={styles.option}
            >
              <View style={[styles.frame, selected && styles.frameSelected]}>
                <ThemePreview preference={option} />
              </View>
              <View style={styles.label}>
                <Radio selected={selected} />
                <Text variant={selected ? 'bodySmMedium' : 'bodySm'}>{t(`theme.${option}`)}</Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </>
  );
};

export const ThemeSheet = memo<ThemeSheetProps>(({ visible, onClose }) => {
  const preference = useThemePreference((s) => s.preference);
  const { capture, apply, release } = useThemeSwitch();
  const [shown, setShown] = useState(preference);

  useEffect(() => {
    if (!visible) return;
    setShown(useThemePreference.getState().preference);
    const timer = setTimeout(capture, motion.sheetIn);
    return () => clearTimeout(timer);
  }, [capture, visible]);

  const select = useCallback(
    (value: ThemePreference, event: GestureResponderEvent) => {
      onClose();
      if (value === preference) return;
      setShown(value);
      apply(value, { x: event.nativeEvent.pageX, y: event.nativeEvent.pageY });
    },
    [apply, onClose, preference],
  );

  return (
    <Sheet visible={visible} onClose={onClose} onHidden={release}>
      <ThemeOptions preference={shown} onSelect={select} />
    </Sheet>
  );
});

ThemeSheet.displayName = 'ThemeSheet';

const useStyles = makeStyles(({ colors }) => ({
  intro: {
    gap: space[2],
    paddingHorizontal: space[1],
  },
  options: {
    flexDirection: 'row',
    gap: space[2.5],
  },
  option: {
    flex: 1,
    gap: space[2.5],
  },
  frame: {
    padding: 3,
    borderRadius: radius.md + 3,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  frameSelected: {
    borderColor: colors.selectedBorder,
  },
  label: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: space[2],
  },
}));
