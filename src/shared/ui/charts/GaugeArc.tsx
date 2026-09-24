import { memo } from 'react';
import Svg, { Circle, G, Line, Path, Text as SvgText } from 'react-native-svg';
import { font, light } from '../../theme';

export type GaugeMark = { value: number; label: string };

export type GaugeArcProps = {
  value: number;
  max: number;
  marks: readonly GaugeMark[];
  activeLabel?: string;
};

const W = 300;
const H = 165;
const CX = 150;
const CY = 150;
const R = 118;

const point = (fraction: number, radius: number) => {
  const angle = Math.PI - fraction * Math.PI;
  return { x: CX + radius * Math.cos(angle), y: CY - radius * Math.sin(angle) };
};

export const GaugeArc = memo<GaugeArcProps>(({ value, max, marks, activeLabel }) => {
  const fraction = Math.max(0, Math.min(1, value / max));
  const start = point(0, R);
  const finish = point(1, R);
  const end = point(fraction, R);

  return (
    <Svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      <Path
        d={`M${start.x} ${start.y} A${R} ${R} 0 0 1 ${finish.x} ${finish.y}`}
        fill="none"
        stroke={light.dataTrack}
        strokeWidth={12}
        strokeLinecap="round"
      />
      <Path
        d={`M${start.x} ${start.y} A${R} ${R} 0 0 1 ${end.x} ${end.y}`}
        fill="none"
        stroke={light.data}
        strokeWidth={12}
        strokeLinecap="round"
      />
      {marks.map((mark) => {
        const f = mark.value / max;
        const inner = point(f, 110);
        const outer = point(f, 126);
        const label = point(f, 138);
        const active = mark.label === activeLabel;
        return (
          <G key={mark.label}>
            <Line x1={inner.x} y1={inner.y} x2={outer.x} y2={outer.y} stroke={light.surface} strokeWidth={3} />
            <SvgText
              x={label.x}
              y={label.y + 3}
              textAnchor="middle"
              fontFamily={active ? font.monoMedium : font.mono}
              fontSize={10}
              fill={active ? light.selectedText : light.textTertiary}
            >
              {mark.label}
            </SvgText>
          </G>
        );
      })}
      <Circle cx={end.x} cy={end.y} r={9} fill={light.surface} stroke={light.selectedText} strokeWidth={3} />
    </Svg>
  );
});

GaugeArc.displayName = 'GaugeArc';
