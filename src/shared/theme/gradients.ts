export const gradientDirection = {
  vertical: { start: { x: 0.5, y: 0 }, end: { x: 0.5, y: 1 } },
  diagonal: { start: { x: 0.29, y: 0.05 }, end: { x: 0.71, y: 0.95 } },
  horizontal: { start: { x: 0, y: 0.5 }, end: { x: 1, y: 0.5 } },
} as const;
