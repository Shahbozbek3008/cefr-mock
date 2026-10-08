import type { CatalogFilter, CatalogMode } from '@cefr/core';
import type { TKey } from '@/shared/i18n';

export { applyCatalog, filterOrder, practiceItems } from '@cefr/core';
export type { CatalogFilter, CatalogMode, CatalogSort, PracticeItem } from '@cefr/core';

export const modeLabels: Record<CatalogMode, TKey> = {
  full: 'catalog.fullMock',
  sections: 'catalog.sectionPractice',
};

export const filterLabels: Record<CatalogFilter, TKey> = {
  all: 'catalog.filters.all',
  free: 'catalog.filters.free',
  new: 'catalog.filters.new',
  completed: 'catalog.filters.completed',
};
