import { memo } from 'react';
import { RefreshControl as NativeRefreshControl } from 'react-native';
import type { RefreshControlProps as NativeProps } from 'react-native';
import { useTheme } from '../theme';

export type RefreshControlProps = NativeProps & {
  offset?: number;
};

export const RefreshControl = memo<RefreshControlProps>(({ offset = 0, ...props }) => {
  const { colors } = useTheme();

  return (
    <NativeRefreshControl
      tintColor={colors.textTertiary}
      colors={[colors.data]}
      progressBackgroundColor={colors.surface}
      progressViewOffset={offset}
      {...props}
    />
  );
});

RefreshControl.displayName = 'RefreshControl';
