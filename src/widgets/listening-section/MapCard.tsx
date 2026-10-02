import { memo } from 'react';
import Svg, { G, Polyline, Rect, Text as SvgText } from 'react-native-svg';
import type { MapSpec } from '@/entities/test';
import { font, radius, space, useTheme } from '@/shared/theme';
import { Card } from '@/shared/ui';

const ROAD_WIDTH = 14;
const LETTER_SIZE = 15;
const NAME_SIZE = 10;
const LABEL_SIZE = 10;

export const MapCard = memo<{ map: MapSpec }>(({ map }) => {
  const { colors } = useTheme();

  return (
    <Card radius={radius.cardLg} style={{ padding: space[3] }}>
      <Svg width="100%" viewBox={`0 0 ${map.width} ${map.height}`} style={{ aspectRatio: map.width / map.height }}>
        {map.roads.map((road, index) => (
          <Polyline
            key={`road-${index}`}
            points={road.points.map(([x, y]) => `${x},${y}`).join(' ')}
            fill="none"
            stroke={colors.surfaceSubtle}
            strokeWidth={ROAD_WIDTH}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}
        {map.blocks.map((block, index) => (
          <G key={`block-${index}`}>
            <Rect
              x={block.x}
              y={block.y}
              width={block.w}
              height={block.h}
              rx={4}
              fill={block.letter ? colors.selectedBg : colors.surfaceMuted}
              stroke={block.letter ? colors.selectedBorder : colors.border}
              strokeWidth={1}
            />
            {block.letter ? (
              <SvgText
                x={block.x + block.w / 2}
                y={block.y + block.h / 2 + LETTER_SIZE / 3}
                fontSize={LETTER_SIZE}
                fontFamily={font.semibold}
                fill={colors.selectedText}
                textAnchor="middle"
              >
                {block.letter}
              </SvgText>
            ) : null}
            {block.name ? (
              <SvgText
                x={block.x + block.w / 2}
                y={block.y + block.h / 2 + NAME_SIZE / 3}
                fontSize={NAME_SIZE}
                fontFamily={font.medium}
                fill={colors.textSecondary}
                textAnchor="middle"
              >
                {block.name}
              </SvgText>
            ) : null}
          </G>
        ))}
        {(map.labels ?? []).map((label, index) => (
          <SvgText
            key={`label-${index}`}
            x={label.x}
            y={label.y}
            fontSize={LABEL_SIZE}
            fontFamily={font.regular}
            fill={colors.textTertiary}
            textAnchor="middle"
          >
            {label.text}
          </SvgText>
        ))}
      </Svg>
    </Card>
  );
});

MapCard.displayName = 'MapCard';
