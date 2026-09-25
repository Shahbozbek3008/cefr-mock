import { Platform, ViewStyle } from 'react-native';
import { palette } from './palette';

type Layer = { x: number; y: number; blur: number; spread: number; color: string };

const boxShadow = (layers: Layer[]): ViewStyle =>
  ({
    boxShadow: layers
      .map((l) => `${l.x}px ${l.y}px ${l.blur}px ${l.spread}px ${l.color}`)
      .join(', '),
  }) as ViewStyle;

const ios = (color: string, opacity: number, blur: number, y: number): ViewStyle => ({
  shadowColor: color,
  shadowOpacity: opacity,
  shadowRadius: blur,
  shadowOffset: { width: 0, height: y },
});

const shadow = (layers: Layer[], fallback: ViewStyle): ViewStyle =>
  Platform.OS === 'android' ? boxShadow(layers) : fallback;

const ink = (alpha: number) => `rgba(20,22,30,${alpha})`;

export const elevation = {
  hairline: {
    borderWidth: 1,
    borderColor: ink(0.06),
  } as ViewStyle,

  segment: shadow(
    [
      { x: 0, y: 1, blur: 2, spread: 0, color: ink(0.08) },
      { x: 0, y: 0, blur: 0, spread: 0.5, color: ink(0.06) },
    ],
    ios('#14161E', 0.08, 1, 1),
  ),

  card: shadow(
    [
      { x: 0, y: 0, blur: 0, spread: 1, color: ink(0.04) },
      { x: 0, y: 1, blur: 2, spread: 0, color: ink(0.04) },
      { x: 0, y: 8, blur: 24, spread: -12, color: ink(0.1) },
    ],
    ios('#14161E', 0.1, 12, 8),
  ),

  cardStrong: shadow(
    [
      { x: 0, y: 0, blur: 0, spread: 1, color: ink(0.04) },
      { x: 0, y: 1, blur: 2, spread: 0, color: ink(0.04) },
      { x: 0, y: 12, blur: 28, spread: -14, color: ink(0.14) },
    ],
    ios('#14161E', 0.14, 14, 12),
  ),

  floating: shadow(
    [
      { x: 0, y: 0, blur: 0, spread: 1, color: ink(0.06) },
      { x: 0, y: 12, blur: 28, spread: -10, color: ink(0.24) },
    ],
    ios('#14161E', 0.24, 14, 12),
  ),

  sheet: shadow(
    [
      { x: 0, y: 0, blur: 0, spread: 1, color: ink(0.04) },
      { x: 0, y: 24, blur: 48, spread: -16, color: ink(0.3) },
    ],
    ios('#14161E', 0.3, 24, 16),
  ),

  sheetUp: shadow(
    [
      { x: 0, y: 0, blur: 0, spread: 1, color: ink(0.04) },
      { x: 0, y: -16, blur: 36, spread: -18, color: ink(0.2) },
    ],
    ios('#14161E', 0.2, 18, -12),
  ),

  action: shadow(
    [{ x: 0, y: 10, blur: 22, spread: -10, color: palette.primary.glow }],
    ios(palette.primary[800], 0.35, 11, 10),
  ),

  actionSm: shadow(
    [{ x: 0, y: 6, blur: 14, spread: -6, color: palette.primary.glow }],
    ios(palette.primary[800], 0.35, 7, 6),
  ),

  actionXs: shadow(
    [{ x: 0, y: 4, blur: 10, spread: -4, color: palette.primary.glow }],
    ios(palette.primary[800], 0.35, 5, 4),
  ),

  selected: shadow(
    [{ x: 0, y: 8, blur: 20, spread: -12, color: 'rgba(67,105,162,0.4)' }],
    ios('#4369A2', 0.4, 10, 8),
  ),

  hero: shadow(
    [{ x: 0, y: 16, blur: 32, spread: -16, color: 'rgba(46,72,126,0.55)' }],
    ios('#2E487E', 0.55, 16, 16),
  ),

  record: shadow(
    [
      { x: 0, y: 0, blur: 0, spread: 1, color: ink(0.06) },
      { x: 0, y: 16, blur: 32, spread: -12, color: 'rgba(203,71,61,0.5)' },
    ],
    ios('#CB473D', 0.5, 16, 16),
  ),

  tabBar: shadow(
    [
      { x: 0, y: 0, blur: 0, spread: 1, color: ink(0.06) },
      { x: 0, y: 16, blur: 32, spread: -14, color: ink(0.22) },
    ],
    ios('#14161E', 0.22, 16, 16),
  ),

  focusRing: {
    outlineWidth: 4,
    outlineStyle: 'solid',
    outlineColor: 'rgba(148,213,60,0.28)',
  } as ViewStyle,

  warningRing: {
    outlineWidth: 3,
    outlineStyle: 'solid',
    outlineColor: '#FFF5E1',
  } as ViewStyle,

  thumb: shadow(
    [{ x: 0, y: 1, blur: 3, spread: 0, color: 'rgba(0,0,0,0.2)' }],
    ios('#000000', 0.2, 3, 1),
  ),
} as const;
