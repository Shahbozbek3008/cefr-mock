import type { Criterion } from '@/entities/result';

export const weakestLabel = (criteria: Criterion[]) =>
  criteria.reduce((min, c) => (c.score / c.max < min.score / min.max ? c : min), criteria[0])?.label;
