import { useQuery } from '@tanstack/react-query';
import { buildTestDetail, delay, tests } from './mock';

export const testKeys = {
  all: ['tests'] as const,
  detail: (id: string) => ['tests', id] as const,
};

export const fetchTests = () => delay(tests);

export const fetchTest = async (id: string) => {
  const summary = tests.find((t) => t.id === id) ?? tests[0];
  return delay(buildTestDetail(summary), 250);
};

export const useTests = () => useQuery({ queryKey: testKeys.all, queryFn: fetchTests });

export const useTest = (id: string) =>
  useQuery({ queryKey: testKeys.detail(id), queryFn: () => fetchTest(id), staleTime: Infinity });
