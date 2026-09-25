import { memo, useState } from 'react';
import { TextInput, View } from 'react-native';
import { makeStyles, radius, space, type, useTheme } from '@/shared/theme';
import { ProgressBar, Text } from '@/shared/ui';
import { countWords } from './draft';

export type EditorProps = {
  value: string;
  onChange: (text: string) => void;
  targetWords: number;
};

export const Editor = memo<EditorProps>(({ value, onChange, targetWords }) => {
  const styles = useStyles();
  const { colors, elevation } = useTheme();
  const [focused, setFocused] = useState(false);
  const words = countWords(value);

  return (
    <View style={[styles.card, focused ? [styles.focused, elevation.focusRing] : styles.idle]}>
      <TextInput
        value={value}
        onChangeText={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        multiline
        textAlignVertical="top"
        autoCapitalize="sentences"
        allowFontScaling={false}
        placeholder="Javobingizni shu yerga yozing…"
        placeholderTextColor={colors.textTertiary}
        selectionColor={colors.selectedBorder}
        cursorColor={colors.selectedBorder}
        accessibilityLabel="Writing javobi"
        style={styles.input}
      />
      <View style={styles.footer}>
        <ProgressBar value={words / targetWords} style={styles.progress} />
        <Text variant="monoSm" color={colors.textSecondary}>
          <Text variant="monoSmMedium">{words}</Text>
          {` / ${targetWords}`}
        </Text>
      </View>
    </View>
  );
});

Editor.displayName = 'Editor';

const useStyles = makeStyles(({ colors }) => ({
  card: {
    flex: 1,
    minHeight: 220,
    borderRadius: radius.card,
    backgroundColor: colors.surface,
    padding: space[4],
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
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
    paddingTop: space[2.5],
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  progress: {
    flex: 1,
  },
}));
