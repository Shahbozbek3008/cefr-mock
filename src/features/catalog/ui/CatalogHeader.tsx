import { memo, useCallback } from 'react';
import { LayoutChangeEvent, View } from 'react-native';
import Animated, {
  Extrapolation,
  SharedValue,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ListFilter } from 'lucide-react-native';
import { useI18n } from '@/shared/i18n';
import { makeStyles, size, space, type, useTheme } from '@/shared/theme';
import { Dot, IconButton, Text } from '@/shared/ui';
import { SearchField } from './SearchField';

const ROW = size.headerBar;
const GAP = space[3.5];
const SEARCH = 48;
const SEARCH_COMPACT = 40;
const BOTTOM = space[3];
const BOTTOM_COMPACT = space[2];
const FILTER = size.iconButton;
const EDGE = size.screenPadding;
const TITLE_INSET = space[1];
const DIVIDER_RANGE = 12;
const TITLE_SCALE = type.heading.fontSize! / type.titleLg.fontSize!;

const EXPANDED = ROW + GAP + SEARCH + BOTTOM;
const COLLAPSED = ROW + BOTTOM_COMPACT;

export const CATALOG_HEADER_HEIGHT = EXPANDED;
export const CATALOG_HEADER_COLLAPSE = EXPANDED - COLLAPSED;

const FILTER_RIGHT = EDGE + TITLE_INSET;
const SEARCH_RIGHT_COMPACT = FILTER_RIGHT + FILTER + space[2];

export type CatalogHeaderProps = {
  scrollY: SharedValue<number>;
  query: string;
  onQueryChange: (value: string) => void;
  onFilterPress: () => void;
};

export const CatalogHeader = memo<CatalogHeaderProps>(({ scrollY, query, onQueryChange, onFilterPress }) => {
  const styles = useStyles();
  const { colors } = useTheme();
  const { t } = useI18n();
  const top = useSafeAreaInsets().top + size.topGap;
  const titleWidth = useSharedValue(0);

  const onTitleLayout = useCallback(
    (event: LayoutChangeEvent) => {
      titleWidth.value = event.nativeEvent.layout.width;
    },
    [titleWidth],
  );

  const rootStyle = useAnimatedStyle(() => {
    const progress = interpolate(scrollY.value, [0, CATALOG_HEADER_COLLAPSE], [0, 1], Extrapolation.CLAMP);
    return {
      height: top + interpolate(progress, [0, 1], [EXPANDED, COLLAPSED]),
      transform: [{ translateY: Math.max(0, -scrollY.value) }],
    };
  });

  const titleStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: interpolate(scrollY.value, [0, CATALOG_HEADER_COLLAPSE], [1, TITLE_SCALE], Extrapolation.CLAMP) },
    ],
  }));

  const searchStyle = useAnimatedStyle(() => {
    const progress = interpolate(scrollY.value, [0, CATALOG_HEADER_COLLAPSE], [0, 1], Extrapolation.CLAMP);
    const compactLeft = EDGE + TITLE_INSET + titleWidth.value * TITLE_SCALE + space[3];
    return {
      top: interpolate(progress, [0, 1], [ROW + GAP, (ROW - SEARCH_COMPACT) / 2]),
      height: interpolate(progress, [0, 1], [SEARCH, SEARCH_COMPACT]),
      left: interpolate(progress, [0, 1], [EDGE, compactLeft]),
      right: interpolate(progress, [0, 1], [EDGE, SEARCH_RIGHT_COMPACT]),
    };
  });

  const dividerStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollY.value,
      [CATALOG_HEADER_COLLAPSE, CATALOG_HEADER_COLLAPSE + DIVIDER_RANGE],
      [0, 1],
      Extrapolation.CLAMP,
    ),
  }));

  return (
    <Animated.View style={[styles.root, { paddingTop: top }, rootStyle]}>
      <View style={styles.area}>
        <Animated.View onLayout={onTitleLayout} style={[styles.title, titleStyle]}>
          <Text variant="titleLg" numberOfLines={1}>
            {t('catalog.title')}
          </Text>
        </Animated.View>

        <Animated.View style={[styles.search, searchStyle]}>
          <SearchField value={query} onChange={onQueryChange} />
        </Animated.View>

        <View style={styles.filter}>
          <IconButton accessibilityLabel={t('catalog.sort')} onPress={onFilterPress}>
            <ListFilter size={18} color={colors.textStrong} strokeWidth={1.6} />
            <View style={styles.filterDot}>
              <Dot color={colors.data} size={7} />
            </View>
          </IconButton>
        </View>
      </View>

      <Animated.View pointerEvents="none" style={[styles.divider, dividerStyle]} />
    </Animated.View>
  );
});

CatalogHeader.displayName = 'CatalogHeader';

const useStyles = makeStyles(({ colors }) => ({
  root: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    overflow: 'hidden',
    backgroundColor: colors.bg,
  },
  area: {
    flex: 1,
  },
  title: {
    position: 'absolute',
    top: 0,
    left: EDGE + TITLE_INSET,
    height: ROW,
    justifyContent: 'center',
    transformOrigin: 'left center',
  },
  search: {
    position: 'absolute',
  },
  filter: {
    position: 'absolute',
    top: (ROW - FILTER) / 2,
    right: FILTER_RIGHT,
  },
  filterDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    borderWidth: 2,
    borderColor: colors.surface,
    borderRadius: 6,
  },
  divider: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: size.hairline,
    backgroundColor: colors.divider,
  },
}));
