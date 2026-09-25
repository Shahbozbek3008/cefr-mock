import { memo } from 'react';
import { TextInput, View } from 'react-native';
import { Search } from 'lucide-react-native';
import { makeStyles, radius, space, type, useTheme } from '@/shared/theme';

export type SearchFieldProps = {
  value: string;
  onChange: (value: string) => void;
};

export const SearchField = memo<SearchFieldProps>(({ value, onChange }) => {
  const styles = useStyles();
  const { colors } = useTheme();

  return (
    <View style={styles.field}>
      <Search size={18} color={colors.textTertiary} strokeWidth={1.6} />
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder="Test yoki mavzu qidirish"
        placeholderTextColor={colors.textTertiary}
        selectionColor={colors.selectedBorder}
        allowFontScaling={false}
        returnKeyType="search"
        style={styles.input}
      />
    </View>
  );
});

SearchField.displayName = 'SearchField';

const useStyles = makeStyles(({ colors }) => ({
  field: {
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.hairlineSoft,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2.5],
    paddingHorizontal: space[3.5],
  },
  input: {
    ...type.label,
    flex: 1,
    color: colors.text,
    padding: 0,
  },
}));
