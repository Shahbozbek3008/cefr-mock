export const space = {
  0: 0,
  0.5: 2,
  1: 4,
  1.5: 6,
  2: 8,
  2.5: 10,
  3: 12,
  3.5: 14,
  4: 16,
  4.5: 18,
  5: 20,
  5.5: 22,
  6: 24,
  7: 28,
  8: 32,
  10: 40,
  12: 48,
} as const;

export const radius = {
  xxs: 5,
  xs: 6,
  chip: 7,
  tag: 8,
  segment: 9,
  sm: 10,
  tile: 11,
  input: 12,
  track: 13,
  md: 14,
  button: 16,
  lg: 18,
  xl: 20,
  card: 22,
  cardLg: 24,
  hero: 28,
  sheet: 32,
  sheetLg: 40,
  pill: 999,
} as const;

export const size = {
  screenPadding: 20,
  screenPaddingWide: 24,
  topGap: 6,
  headerBar: 44,
  buttonL: 56,
  buttonM: 52,
  buttonS: 36,
  iconButton: 40,
  field: 52,
  fieldL: 56,
  tabBar: 64,
  tabBarGap: 12,
  minTap: 44,
  hairline: 1,
} as const;

export const motion = {
  fast: 140,
  base: 220,
  sheet: 320,
  spring: { damping: 26, stiffness: 300 },
} as const;

export const hitSlop = { top: 8, bottom: 8, left: 8, right: 8 } as const;
