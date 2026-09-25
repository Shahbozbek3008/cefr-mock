import { memo, useCallback, useRef } from 'react';
import { GestureResponderEvent, Pressable, View } from 'react-native';
import { useI18n } from '@/shared/i18n';
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
  const { t } = useI18n();
  const preference = useThemePreference((s) => s.preference);
  const { prepare, apply } = useThemeSwitch();
  const pending = useRef<{ preference: ThemePreference; origin: Origin; ready: Promise<boolean> } | null>(null);

  const select = useCallback(
    (value: ThemePreference, event: GestureResponderEvent) => {
      if (value === preference) {
        onClose();
        return;
      }
      pending.current = {
        preference: value,
        origin: { x: event.nativeEvent.pageX, y: event.nativeEvent.pageY },
        ready: prepare(value),
      };
      onClose();
    },
    [onClose, prepare, preference],
  );

  const onHidden = useCallback(async () => {
    const next = pending.current;
    pending.current = null;
    if (!next) return;
    await next.ready;
    apply(next.preference, next.origin);
  }, [apply]);

  return (
    <Sheet visible={visible} onClose={onClose} onHidden={onHidden}>
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
              onPress={(event) => select(option, event)}
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
