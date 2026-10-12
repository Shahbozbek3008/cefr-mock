import { ReactNode, memo } from 'react';
import { Pressable, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { makeStyles, space, useTheme } from '../theme';
import { IconTile } from './IconTile';
import { Text } from './Text';

export type ListRowProps = {
  icon?: ReactNode;
  title: string;
  value?: string;
  trailing?: ReactNode;
  chevron?: boolean;
  divider?: boolean;
  height?: number;
  onPress?: () => void;
};

export const ListRow = memo<ListRowProps>(
  ({ icon, title, value, trailing, chevron = true, divider = false, height = 56, onPress }) => {
    const styles = useStyles();
    const { colors } = useTheme();

    return (
      <Pressable
        accessibilityRole={onPress ? 'button' : undefined}
        disabled={!onPress}
        onPress={onPress}
        style={({ pressed }) => [styles.row, { height }, divider && styles.divider, pressed && styles.pressed]}
      >
        {icon ? <IconTile size={32}>{icon}</IconTile> : null}
        <Text variant="label" style={styles.title}>
          {title}
        </Text>
        {value ? (
          <Text variant="bodySm" color={colors.textSecondary}>
            {value}
          </Text>
        ) : null}
        {trailing}
        {chevron && !trailing ? <ChevronRight size={16} color={colors.borderStrong} strokeWidth={1.75} /> : null}
      </Pressable>
    );
  },
);

ListRow.displayName = 'ListRow';

export const ListGroup = memo<{ children: ReactNode }>(({ children }) => {
  const styles = useStyles();
  return <View style={styles.group}>{children}</View>;
});

ListGroup.displayName = 'ListGroup';

const useStyles = makeStyles(({ colors }) => ({
  group: {
    backgroundColor: colors.surface,
    borderRadius: 22,
    paddingHorizontal: space[4],
    borderWidth: 1,
    borderColor: colors.hairlineSoft,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  title: {
    flex: 1,
  },
  pressed: {
    opacity: 0.6,
  },
}));
