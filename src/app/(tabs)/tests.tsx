import { useCallback, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { FlashList } from '@shopify/flash-list';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ListFilter } from 'lucide-react-native';
import { useTests } from '@/entities/test';
import type { TestSummary } from '@/entities/test';
import {
  applyCatalog,
  filterLabels,
  filterOrder,
  modeOptions,
  practiceItems,
} from '@/features/catalog/model/filters';
import type { CatalogFilter, CatalogMode, CatalogSort, PracticeItem } from '@/features/catalog/model/filters';
import { PracticeCard } from '@/features/catalog/ui/PracticeCard';
import { SearchField } from '@/features/catalog/ui/SearchField';
import { TestCard } from '@/features/catalog/ui/TestCard';
import { light, size, space } from '@/shared/theme';
import {
  Chip,
  Dot,
  IconButton,
  Radio,
  SegmentedControl,
  Sheet,
  SkeletonCard,
  StateView,
  Text,
} from '@/shared/ui';
import { TAB_BAR_SPACE } from '@/widgets/tab-bar';

const sortOptions: { value: CatalogSort; label: string }[] = [
  { value: 'newest', label: 'Avval yangilari' },
  { value: 'oldest', label: 'Avval eskilari' },
];

export default function TestsScreen() {
  const insets = useSafeAreaInsets();
  const tests = useTests();
  const [mode, setMode] = useState<CatalogMode>('full');
  const [filter, setFilter] = useState<CatalogFilter>('all');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<CatalogSort>('newest');
  const [sortOpen, setSortOpen] = useState(false);

  const list = useMemo(
    () => applyCatalog(tests.data ?? [], filter, query, sort),
    [tests.data, filter, query, sort],
  );

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
      router.push({ pathname: '/test/[id]/[section]', params: { id: test.id, section: test.resumeSection ?? 'listening' } });
      return;
    }
    router.push({ pathname: '/test/[id]', params: { id: test.id } });
  }, []);

  const onPracticePress = useCallback((item: PracticeItem) => {
    router.push({ pathname: '/test/[id]/[section]', params: { id: 't13', section: item.kind } });
  }, []);

  const header = (
    <View style={styles.header}>
      <View style={styles.titleRow}>
        <Text variant="titleLg">Testlar</Text>
        <IconButton accessibilityLabel="Saralash" onPress={() => setSortOpen(true)}>
          <ListFilter size={18} color={light.textStrong} strokeWidth={1.6} />
          <View style={styles.filterDot}>
            <Dot color={light.data} size={7} />
          </View>
        </IconButton>
      </View>

      <SearchField value={query} onChange={setQuery} />

      <SegmentedControl options={modeOptions} value={mode} onChange={setMode} size="lg" />

      {mode === 'full' ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsScroll} contentContainerStyle={styles.chips}>
          {filterOrder.map((key) => (
            <Chip
              key={key}
              label={key === 'all' ? `${filterLabels[key]} · ${tests.data?.length ?? 0}` : filterLabels[key]}
              active={filter === key}
              onPress={() => setFilter(key)}
            />
          ))}
        </ScrollView>
      ) : null}
    </View>
  );

  const contentStyle = {
    paddingTop: insets.top + size.topGap,
    paddingBottom: insets.bottom + TAB_BAR_SPACE + space[4],
    paddingHorizontal: size.screenPadding,
  };

  return (
    <View style={styles.screen}>
      {mode === 'sections' ? (
        <FlashList
          data={practiceItems}
          keyExtractor={(item) => item.kind}
          renderItem={({ item }) => <PracticeCard item={item} onPress={onPracticePress} />}
          ItemSeparatorComponent={Separator}
          ListHeaderComponent={header}
          contentContainerStyle={contentStyle}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <FlashList
          data={tests.isPending ? [] : list}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <TestCard test={item} onPress={onTestPress} />}
          ItemSeparatorComponent={Separator}
          ListHeaderComponent={header}
          ListEmptyComponent={
            tests.isPending ? (
              <View style={styles.skeletons}>
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
              </View>
            ) : tests.isError ? (
              <StateView tone="error" title="Xatolik" message="Internetni tekshiring" actionLabel="Qayta" onAction={() => tests.refetch()} />
            ) : (
              <StateView title="Natija yo'q" message="Boshqa filtr yoki so'z bilan qidiring" actionLabel="Tozalash" onAction={() => { setFilter('all'); setQuery(''); }} />
            )
          }
          contentContainerStyle={contentStyle}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        />
      )}

      <Sheet visible={sortOpen} onClose={() => setSortOpen(false)}>
        <Text variant="titleSheet" style={styles.sheetTitle}>
          Saralash
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
              <Text variant="label">{option.label}</Text>
            </Pressable>
          ))}
        </View>
      </Sheet>
    </View>
  );
}

const Separator = () => <View style={styles.separator} />;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: light.bg,
  },
  header: {
    gap: space[3.5],
    paddingBottom: space[3.5],
  },
  titleRow: {
    height: size.headerBar,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: space[1],
  },
  filterDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    borderWidth: 2,
    borderColor: light.surface,
    borderRadius: 6,
  },
  chipsScroll: {
    marginRight: -size.screenPadding,
  },
  chips: {
    gap: space[1.5],
    paddingRight: size.screenPadding,
  },
  separator: {
    height: space[2.5],
  },
  skeletons: {
    gap: space[2.5],
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
});
