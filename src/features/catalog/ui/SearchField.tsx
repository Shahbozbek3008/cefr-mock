import { memo } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { Search } from 'lucide-react-native';
import { light, radius, space, type } from '@/shared/theme';

export type SearchFieldProps = {
  value: string;
  onChange: (value: string) => void;
};

export const SearchField = memo<SearchFieldProps>(({ value, onChange }) => (
  <View style={styles.field}>
    <Search size={18} color={light.textTertiary} strokeWidth={1.6} />
    <TextInput
      value={value}
      onChangeText={onChange}
      placeholder="Test yoki mavzu qidirish"
      placeholderTextColor={light.textTertiary}
      selectionColor={light.selectedBorder}
      allowFontScaling={false}
      returnKeyType="search"
      style={styles.input}
    />
  </View>
));

SearchField.displayName = 'SearchField';

const styles = StyleSheet.create({
  field: {
    height: 48,
    borderRadius: radius.md,
    backgroundColor: light.surface,
    borderWidth: 1,
    borderColor: light.hairlineSoft,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2.5],
    paddingHorizontal: space[3.5],
  },
  input: {
    ...type.label,
    flex: 1,
    color: light.text,
    padding: 0,
  },
});
