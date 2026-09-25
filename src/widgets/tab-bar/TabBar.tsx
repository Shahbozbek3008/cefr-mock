import { ComponentProps, memo } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import { Tabs } from 'expo-router';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChartLine, House, Layers, LucideIcon, UserRound } from 'lucide-react-native';
import { useI18n } from '@/shared/i18n';
import type { TKey } from '@/shared/i18n';
import { makeStyles, radius, size, space, useTheme } from '@/shared/theme';
import { Text } from '@/shared/ui';

type TabBarProps = Parameters<NonNullable<ComponentProps<typeof Tabs>['tabBar']>>[0];

const items: Record<string, { label: TKey; Icon: LucideIcon }> = {
  home: { label: 'tabs.home', Icon: House },
  tests: { label: 'tabs.tests', Icon: Layers },
  progress: { label: 'tabs.progress', Icon: ChartLine },
  profile: { label: 'tabs.profile', Icon: UserRound },
};

export const TAB_BAR_SPACE = size.tabBar + size.tabBarGap * 2;

export const TabBar = memo(({ state, navigation }: TabBarProps) => {
  const styles = useStyles();
  const { colors, elevation, scheme } = useTheme();
  const { t } = useI18n();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.bar, elevation.tabBar, { bottom: insets.bottom + size.tabBarGap }]}>
      {Platform.OS === 'ios' ? (
        <BlurView intensity={40} tint={scheme} style={[StyleSheet.absoluteFill, styles.blur]} />
      ) : null}
      <View style={[StyleSheet.absoluteFill, styles.fill]} />
      {state.routes.map((route, index) => {
        const item = items[route.name];
        if (!item) return null;
        const focused = state.index === index;
        const color = focused ? colors.selectedText : colors.textSecondary;

        const onPress = () => {
          const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!focused && !event.defaultPrevented) navigation.navigate(route.name);
        };

        return (
          <Pressable
            key={route.key}
            accessibilityRole="tab"
            accessibilityState={{ selected: focused }}
            accessibilityLabel={t(item.label)}
            onPress={onPress}
            style={[styles.item, focused && styles.itemActive]}
          >
            <item.Icon size={20} color={color} strokeWidth={focused ? 1.6 : 1.5} />
            <Text variant={focused ? 'nanoMedium' : 'nano'} color={color}>
              {t(item.label)}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
});

TabBar.displayName = 'TabBar';

const useStyles = makeStyles(({ colors }) => ({
  bar: {
    position: 'absolute',
    left: space[4],
    right: space[4],
    height: size.tabBar,
    borderRadius: radius.cardLg,
    flexDirection: 'row',
    padding: space[1.5],
    borderWidth: 1,
    borderColor: colors.hairline,
  },
  blur: {
    borderRadius: radius.cardLg,
    overflow: 'hidden',
  },
  fill: {
    borderRadius: radius.cardLg,
    backgroundColor: colors.glass,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: space[0.5],
    borderRadius: radius.lg,
  },
  itemActive: {
    backgroundColor: colors.chipActiveBg,
  },
}));
