import { memo, useState } from 'react';
import { Keyboard, TextInput, View } from 'react-native';
import { useI18n } from '@/shared/i18n';
import { makeStyles, radius, space, type, useTheme } from '@/shared/theme';
import { Button, ProgressBar, Text } from '@/shared/ui';
import { countWords } from './draft';
import { SavedNote } from './SavedNote';

export type EditorProps = {
  value: string;
  onChange: (text: string) => void;
  targetWords: number;
  minWords: number;
};

export const Editor = memo<EditorProps>(({ value, onChange, targetWords, minWords }) => {
  const styles = useStyles();
  const { colors, elevation } = useTheme();
  const { t } = useI18n();
  const [focused, setFocused] = useState(false);
  const words = countWords(value);
  const enough = words >= minWords;

  return (
    <View style={[styles.card, focused ? [styles.focused, elevation.focusRing] : styles.idle]}>
      <TextInput
        value={value}
        onChangeText={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        multiline
        scrollEnabled
        autoCapitalize="sentences"
        allowFontScaling={false}
        placeholder={t('writing.placeholder')}
        placeholderTextColor={colors.textTertiary}
        selectionColor={colors.selectedBorder}
        cursorColor={colors.selectedBorder}
        accessibilityLabel={t('writing.answerA11y')}
        style={styles.input}
      />

      <View style={styles.footer}>
        <View style={styles.count}>
          <ProgressBar
            value={words / targetWords}
            marker={minWords / targetWords}
            color={enough ? colors.action : colors.data}
            style={styles.progress}
          />
          <Text variant="monoSm" color={colors.textSecondary}>
            <Text variant="monoSmMedium" color={enough ? colors.selectedText : colors.text}>
              {words}
            </Text>
            {` / ${targetWords}`}
          </Text>
        </View>
        <View style={styles.status}>
          <SavedNote />
          {focused ? <Button label={t('writing.done')} variant="soft" size="S" onPress={Keyboard.dismiss} /> : null}
        </View>
      </View>
    </View>
  );
});

Editor.displayName = 'Editor';

const STATUS_HEIGHT = 32;

const useStyles = makeStyles(({ colors }) => ({
  card: {
    flex: 1,
    minHeight: 160,
    borderRadius: radius.card,
    backgroundColor: colors.surface,
    paddingTop: space[3.5],
    paddingHorizontal: space[4],
    paddingBottom: space[3],
    gap: space[2.5],
  },
  idle: {
    borderWidth: 1,
    borderColor: colors.hairlineSoft,
  },
  focused: {
    borderWidth: 1.5,
    borderColor: colors.selectedBorder,
  },
  input: {
    ...type.editor,
    flex: 1,
    color: colors.text,
    padding: 0,
    textAlignVertical: 'top',
  },
  footer: {
    gap: space[2],
    paddingTop: space[2.5],
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  count: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
  },
  progress: {
    flex: 1,
  },
  status: {
    height: STATUS_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
}));
