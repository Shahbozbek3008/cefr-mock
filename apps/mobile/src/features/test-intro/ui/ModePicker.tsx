import { memo } from 'react';
import { View } from 'react-native';
import { Dumbbell, ShieldCheck } from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';
import type { AttemptMode } from '@/entities/attempt';
import { useI18n } from '@/shared/i18n';
import type { TKey } from '@/shared/i18n';
import { makeStyles, radius, space, useTheme } from '@/shared/theme';
import { Radio, SelectCard, Text } from '@/shared/ui';

type ModeOption = { mode: AttemptMode; icon: LucideIcon; title: TKey; description: TKey };

const options: ModeOption[] = [
  { mode: 'exam', icon: ShieldCheck, title: 'testIntro.examMode', description: 'testIntro.examModeHint' },
  { mode: 'practice', icon: Dumbbell, title: 'testIntro.practiceMode', description: 'testIntro.practiceModeHint' },
];

export type ModePickerProps = {
  value: AttemptMode;
  locked: boolean;
  onChange: (mode: AttemptMode) => void;
};

export const ModePicker = memo<ModePickerProps>(({ value, locked, onChange }) => {
  const styles = useStyles();
  const { colors } = useTheme();
  const { t } = useI18n();
  const visible = locked ? options.filter((option) => option.mode === value) : options;

  return (
    <View style={styles.root}>
      <Text variant="calloutMedium" style={styles.label}>
        {t('testIntro.mode')}
      </Text>
      {visible.map(({ mode, icon: Icon, title, description }) => {
        const selected = mode === value;
        return (
          <SelectCard
            key={mode}
            selected={selected}
            accessibilityLabel={t(title)}
            onPress={() => (locked ? undefined : onChange(mode))}
            style={styles.card}
          >
            <View style={[styles.icon, selected && styles.iconSelected]}>
              <Icon size={18} color={selected ? colors.selectedText : colors.textStrong} strokeWidth={1.7} />
            </View>
            <View style={styles.body}>
              <Text variant="labelMedium">{t(title)}</Text>
              <Text variant="callout" color={colors.textSecondary}>
                {t(description)}
              </Text>
            </View>
            {locked ? null : <Radio selected={selected} />}
          </SelectCard>
        );
      })}
      {locked ? (
        <Text variant="caption" color={colors.textTertiary} style={styles.label}>
          {t('testIntro.modeLocked')}
        </Text>
      ) : null}
    </View>
  );
});

ModePicker.displayName = 'ModePicker';

const useStyles = makeStyles(({ colors }) => ({
  root: {
    gap: space[2.5],
  },
  label: {
    paddingHorizontal: space[1],
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconSelected: {
    backgroundColor: colors.surface,
  },
  body: {
    flex: 1,
    gap: space[0.5],
  },
}));
