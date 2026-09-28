import { useCallback, useMemo, useState } from 'react';
import { FlatList, Pressable, ScrollView, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTests } from '@/entities/test';
import type { TestSummary } from '@/entities/test';
import { applyCatalog, filterLabels, filterOrder, modeLabels, practiceItems } from '@/features/catalog/model/filters';
import type { CatalogFilter, CatalogMode, CatalogSort, PracticeItem } from '@/features/catalog/model/filters';
import { CATALOG_HEADER_COLLAPSE, CATALOG_HEADER_HEIGHT, CatalogHeader } from '@/features/catalog/ui/CatalogHeader';
import { PracticeCard } from '@/features/catalog/ui/PracticeCard';
import { TestCard } from '@/features/catalog/ui/TestCard';
import { TestListSkeleton } from '@/features/catalog/ui/TestListSkeleton';
import { useI18n } from '@/shared/i18n';
import type { TKey } from '@/shared/i18n';
import { useRefresh, useScrollHeader } from '@/shared/lib';
import { makeStyles, size, space } from '@/shared/theme';
import { Chip, Radio, RefreshControl, SegmentedControl, Sheet, StateView, Text } from '@/shared/ui';
import { TAB_BAR_SPACE } from '@/widgets/tab-bar';

const sortOptions: { value: CatalogSort; label: TKey }[] = [
  { value: 'newest', label: 'catalog.newestFirst' },
  { value: 'oldest', label: 'catalog.oldestFirst' },
];

const modes: CatalogMode[] = ['full', 'sections'];

export default function TestsScreen() {
  const styles = useStyles();
  const { t } = useI18n();
  const modeOptions = useMemo(() => modes.map((value) => ({ value, label: t(modeLabels[value]) })), [t]);
  const insets = useSafeAreaInsets();
  const tests = useTests();
  const refresh = useRefresh(tests.refetch);
  const [mode, setMode] = useState<CatalogMode>('full');
  const [filter, setFilter] = useState<CatalogFilter>('all');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<CatalogSort>('newest');
  const [sortOpen, setSortOpen] = useState(false);
  const { scrollY, scrollRef, onScroll } = useScrollHeader<FlatList>(CATALOG_HEADER_COLLAPSE);
  const headerTop = insets.top + size.topGap + CATALOG_HEADER_HEIGHT;

  const changeMode = useCallback(
    (next: CatalogMode) => {
      scrollY.value = 0;
      setMode(next);
    },
    [scrollY],
  );

  const list = useMemo(() => applyCatalog(tests.data ?? [], filter, query, sort), [tests.data, filter, query, sort]);

  const onTestPress = useCallback((test: TestSummary) => {
    if (test.status === 'locked') {
      router.push('/subscription');
      return;
    }
    if (test.status === 'completed' && test.resultId) {
      router.push({ pathname: '/result/[id]', params: { id: test.resultId } });
      return;
    }
    if (test.status === 'in_progress') {
      router.push({
        pathname: '/test/[id]/[section]',
        params: { id: test.id, section: test.resumeSection ?? 'listening' },
      });
      return;
    }
    router.push({ pathname: '/test/[id]', params: { id: test.id } });
  }, []);

  const onPracticePress = useCallback((item: PracticeItem) => {
    router.push({ pathname: '/test/[id]/[section]', params: { id: 't13', section: item.kind } });
  }, []);

  const header = (
    <View style={styles.header}>
      <SegmentedControl options={modeOptions} value={mode} onChange={changeMode} size="lg" />

      {mode === 'full' ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.chipsScroll}
          contentContainerStyle={styles.chips}
        >
          {filterOrder.map((key) => (
            <Chip
              key={key}
              label={key === 'all' ? `${t(filterLabels[key])} · ${tests.data?.length ?? 0}` : t(filterLabels[key])}
              active={filter === key}
              onPress={() => setFilter(key)}
            />
          ))}
        </ScrollView>
      ) : null}
    </View>
  );

  const refreshControl = (
    <RefreshControl refreshing={refresh.refreshing} onRefresh={refresh.onRefresh} offset={headerTop} />
  );

  const contentStyle = {
    paddingTop: headerTop,
    paddingBottom: insets.bottom + TAB_BAR_SPACE + space[4],
    paddingHorizontal: size.screenPadding,
  };

  return (
    <View style={styles.screen}>
      {mode === 'sections' ? (
        <Animated.FlatList
          ref={scrollRef}
          onScroll={onScroll}
          scrollEventThrottle={16}
          data={practiceItems}
          keyExtractor={(item) => item.kind}
          renderItem={({ item }) => <PracticeCard item={item} onPress={onPracticePress} />}
          ItemSeparatorComponent={Separator}
          ListHeaderComponent={header}
          contentContainerStyle={contentStyle}
          refreshControl={refreshControl}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <Animated.FlatList
          ref={scrollRef}
          onScroll={onScroll}
          scrollEventThrottle={16}
          data={tests.isPending ? [] : list}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <TestCard test={item} onPress={onTestPress} />}
          ItemSeparatorComponent={Separator}
          ListHeaderComponent={header}
          ListEmptyComponent={
            tests.isPending ? (
              <TestListSkeleton />
            ) : tests.isError ? (
              <StateView
                tone="error"
                title={t('common.error')}
                message={t('common.checkInternet')}
                actionLabel={t('common.retry')}
                onAction={() => tests.refetch()}
              />
            ) : (
              <StateView
                title={t('catalog.emptyTitle')}
                message={t('catalog.emptyMessage')}
                actionLabel={t('common.clear')}
                onAction={() => {
                  setFilter('all');
                  setQuery('');
                }}
              />
            )
          }
          contentContainerStyle={contentStyle}
          refreshControl={refreshControl}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        />
      )}

      <CatalogHeader scrollY={scrollY} query={query} onQueryChange={setQuery} onFilterPress={() => setSortOpen(true)} />

      <Sheet visible={sortOpen} onClose={() => setSortOpen(false)}>
        <Text variant="titleSheet" style={styles.sheetTitle}>
          {t('catalog.sort')}
        </Text>
        <View style={styles.sortList}>
          {sortOptions.map((option) => (
            <Pressable
              key={option.value}
              accessibilityRole="radio"
              accessibilityState={{ selected: sort === option.value }}
              onPress={() => {
                setSort(option.value);
                setSortOpen(false);
              }}
              style={styles.sortRow}
            >
              <Radio selected={sort === option.value} />
              <Text variant="label">{t(option.label)}</Text>
            </Pressable>
          ))}
        </View>
      </Sheet>
    </View>
  );
}

const Separator = () => {
  const styles = useStyles();
  return <View style={styles.separator} />;
};

const useStyles = makeStyles(({ colors }) => ({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  header: {
    gap: space[3.5],
    paddingBottom: space[3.5],
  },
  chipsScroll: {
    marginHorizontal: -size.screenPadding,
  },
  chips: {
    gap: space[1.5],
    paddingHorizontal: size.screenPadding,
  },
  separator: {
    height: space[2.5],
  },
  sheetTitle: {
    paddingHorizontal: space[1],
  },
  sortList: {
    gap: space[1],
  },
  sortRow: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
    paddingHorizontal: space[1],
  },
}));
