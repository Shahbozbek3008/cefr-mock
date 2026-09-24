import { memo, useMemo } from 'react';
import Svg, { Circle, Line, Polygon, Polyline, Text as SvgText } from 'react-native-svg';
import { font, light } from '../../theme';

export type LineChartGuide = { value: number; label: string; strong?: boolean };

export type LineChartProps = {
  values: readonly number[];
  guides: readonly LineChartGuide[];
  domain: readonly [number, number];
  height?: number;
};

const VW = 332;
const VH = 170;
const BASE = 150;
const PAD_X = 12;

export const LineChart = memo<LineChartProps>(({ values, guides, domain, height = 136 }) => {
  const [min, max] = domain;

  const points = useMemo(() => {
    const step = values.length > 1 ? (VW - PAD_X * 2) / (values.length - 1) : 0;
    return values.map((v, i) => ({ x: PAD_X + i * step, y: VH - ((v - min) / (max - min)) * VH }));
  }, [values, min, max]);

  const toY = (v: number) => VH - ((v - min) / (max - min)) * VH;

  if (points.length === 0) return null;

  const line = points.map((p) => `${p.x},${p.y.toFixed(1)}`).join(' ');
  const last = points[points.length - 1];
  const area = `${PAD_X},${BASE} ${line} ${last.x},${BASE}`;

  return (
    <Svg width="100%" height={height} viewBox={`0 0 ${VW} ${VH}`} preserveAspectRatio="none">
      {guides.map((g) => (
        <Line
          key={`${g.label}-line`}
          x1={0}
          x2={VW}
          y1={toY(g.value)}
          y2={toY(g.value)}
          stroke={g.strong ? light.borderStrong : light.border}
          strokeDasharray="3 4"
        />
      ))}
      {guides.map((g) => (
        <SvgText
          key={`${g.label}-text`}
          x={VW - 2}
          y={g.strong ? toY(g.value) - 5 : toY(g.value) + 12}
          textAnchor="end"
          fontFamily={font.mono}
          fontSize={9}
          fill={light.textTertiary}
        >
          {g.label}
        </SvgText>
      ))}
      <Polygon points={area} fill={light.data} fillOpacity={0.08} />
      <Polyline
        points={line}
        fill="none"
        stroke={light.data}
        strokeWidth={2.2}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {points.slice(0, -1).map((p, i) => (
        <Circle key={i} cx={p.x} cy={p.y} r={2.5} fill={light.data} />
      ))}
      <Circle cx={last.x} cy={last.y} r={5} fill={light.surface} stroke={light.data} strokeWidth={2.5} />
    </Svg>
  );
});

LineChart.displayName = 'LineChart';
