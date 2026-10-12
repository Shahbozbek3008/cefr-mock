import { Platform, TextStyle } from 'react-native';

export const font = {
  light: 'Manrope-Light',
  regular: 'Manrope-Regular',
  medium: 'Manrope-Medium',
  semibold: 'Manrope-SemiBold',
  mono: 'GeistMono-Regular',
  monoMedium: 'GeistMono-Medium',
  serif: Platform.select({ ios: 'Georgia', default: 'serif' }),
} as const;

const androidFix: TextStyle = Platform.select<TextStyle>({
  android: { includeFontPadding: false, textAlignVertical: 'center' },
  default: {},
});

const em = (value: number, size: number) => Number((value * size).toFixed(2));

const make = (fontFamily: string, fontSize: number, lineHeight: number, tracking = 0): TextStyle => ({
  fontFamily,
  fontSize,
  lineHeight,
  letterSpacing: em(tracking, fontSize),
  ...androidFix,
});

export const type = {
  displayXl: make(font.light, 64, 58, -0.03),
  display: make(font.light, 56, 50, -0.03),
  displayMd: make(font.light, 48, 44, -0.03),
  displaySm: make(font.light, 40, 36, -0.027),
  numeral: make(font.light, 36, 36, -0.025),

  statLg: make(font.regular, 26, 26, -0.02),
  statMd: make(font.regular, 22, 22, -0.02),

  titleXl: make(font.semibold, 30, 34, -0.017),
  titleLg: make(font.semibold, 28, 32, -0.017),
  titleLogo: make(font.semibold, 24, 28, -0.015),
  titleSheet: make(font.semibold, 22, 28, -0.015),
  titleMd: make(font.semibold, 20, 25, -0.012),
  titleReading: make(font.semibold, 19, 25, -0.012),
  titleBadge: make(font.semibold, 18, 22, -0.01),
  heading: make(font.semibold, 17, 22, -0.007),
  titleSm: make(font.medium, 16, 22),

  lead: make(font.regular, 17, 25),
  body: make(font.regular, 16, 24),
  bodyMedium: make(font.medium, 16, 24),
  label: make(font.regular, 15, 21),
  labelRelaxed: make(font.regular, 15, 23),
  labelMedium: make(font.medium, 15, 21, -0.005),
  bodySm: make(font.regular, 14, 20),
  bodySmRelaxed: make(font.regular, 14, 21),
  bodySmMedium: make(font.medium, 14, 20),
  callout: make(font.regular, 13, 18),
  calloutRelaxed: make(font.regular, 13, 20),
  calloutMedium: make(font.medium, 13, 18),
  caption: make(font.regular, 12, 16),
  captionRelaxed: make(font.regular, 12, 18),
  captionMedium: make(font.medium, 12, 16),
  micro: make(font.regular, 11, 15),
  microMedium: make(font.medium, 11, 15),
  nano: make(font.regular, 10, 13),
  nanoMedium: make(font.medium, 10, 13),
  pico: make(font.regular, 9, 11),

  reading: make(font.regular, 17, 30),
  readingSm: make(font.regular, 15, 26),
  editor: make(font.regular, 16, 27),
  serifLabel: make(font.serif, 14, 18),

  monoTimer: make(font.mono, 34, 36, -0.04),
  monoXl: make(font.mono, 24, 28),
  monoLg: make(font.mono, 22, 26, -0.03),
  monoMd: make(font.mono, 20, 24, -0.03),
  monoField: make(font.mono, 16, 20, 0.02),
  mono: make(font.mono, 14, 18),
  monoMedium: make(font.monoMedium, 14, 18),
  monoCallout: make(font.mono, 13, 17),
  monoCalloutMedium: make(font.monoMedium, 13, 17),
  monoSm: make(font.mono, 12, 16),
  monoSmMedium: make(font.monoMedium, 12, 16),
  monoXs: make(font.mono, 11, 14),
  monoLabel: make(font.mono, 11, 14, 0.02),
  monoNano: make(font.mono, 10, 13),
} as const;

export type TypeToken = keyof typeof type;
