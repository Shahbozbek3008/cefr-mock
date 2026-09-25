import { memo, useCallback, useRef } from 'react';
import { GestureResponderEvent, Pressable, View } from 'react-native';
import { makeStyles, radius, space, useTheme, useThemePreference } from '@/shared/theme';
import type { ThemePreference } from '@/shared/theme';
import { Radio, Sheet, Text } from '@/shared/ui';
import { themeOptions } from '../model/options';
import { ThemePreview } from './ThemePreview';
import { useThemeSwitch } from './ThemeTransitionProvider';
import type { Origin } from './ThemeTransitionProvider';

export type ThemeSheetProps = {
  visible: boolean;
  onClose: () => void;
};

export const ThemeSheet = memo<ThemeSheetProps>(({ visible, onClose }) => {
  const styles = useStyles();
  const { colors } = useTheme();
  const preference = useThemePreference((s) => s.preference);
  const switchTheme = useThemeSwitch();
  const pending = useRef<{ preference: ThemePreference; origin: Origin } | null>(null);

  const select = useCallback(
    (value: ThemePreference, event: GestureResponderEvent) => {
      if (value === preference) {
        onClose();
        return;
      }
      pending.current = { preference: value, origin: { x: event.nativeEvent.pageX, y: event.nativeEvent.pageY } };
      onClose();
    },
    [onClose, preference],
  );

  const onHidden = useCallback(() => {
    const next = pending.current;
    pending.current = null;
    if (next) switchTheme(next.preference, next.origin);
  }, [switchTheme]);

  return (
    <Sheet visible={visible} onClose={onClose} onHidden={onHidden}>
      <View style={styles.intro}>
        <Text variant="titleSheet">Tema</Text>
        <Text variant="labelRelaxed" color={colors.textSecondary}>
          Tizim tanlansa, ilova telefon sozlamasiga moslashadi.
        </Text>
      </View>

      <View style={styles.options}>
        {themeOptions.map((option) => {
          const selected = option.value === preference;
          return (
            <Pressable
              key={option.value}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              accessibilityLabel={option.label}
              onPress={(event) => select(option.value, event)}
              style={styles.option}
            >
              <View style={[styles.frame, selected && styles.frameSelected]}>
                <ThemePreview preference={option.value} />
              </View>
              <View style={styles.label}>
                <Radio selected={selected} />
                <Text variant={selected ? 'bodySmMedium' : 'bodySm'}>{option.label}</Text>
              </View>
            </Pressable>
          );
        })}
      </View>
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
