export const testKeys = {
  all: ['admin-tests'] as const,
  detail: (id: string) => ['admin-tests', id] as const,
};
