import { memo } from 'react';
import { TextStyle } from 'react-native';
import type { TextSegment } from '@/entities/result';
import { light } from '@/shared/theme';
import { Text } from '@/shared/ui';

type Mark = NonNullable<TextSegment['mark']>;

const markStyles: Record<Mark, TextStyle> = {
  grammar: {
    backgroundColor: light.error.bg,
    textDecorationLine: 'underline',
    textDecorationColor: light.error[500],
  },
  lexis: {
    backgroundColor: light.warning.bg,
    textDecorationLine: 'underline',
    textDecorationColor: light.warning[500],
  },
  filler: {
    color: light.textTertiary,
  },
  good: {
    backgroundColor: light.chipActiveBg,
    textDecorationLine: 'underline',
    textDecorationColor: light.data,
  },
};

export type MarkedTextProps = {
  segments: TextSegment[];
  overrides?: Partial<Record<Mark, TextStyle>>;
  onMarkPress?: (text: string) => void;
};

export const MarkedText = memo<MarkedTextProps>(({ segments, overrides, onMarkPress }) => (
  <Text variant="readingSm" color={light.textReading}>
    {segments.map((segment, index) =>
      segment.mark ? (
        <Text
          key={index}
          variant="readingSm"
          color={light.textReading}
          suppressHighlighting
          onPress={onMarkPress ? () => onMarkPress(segment.text) : undefined}
          style={[markStyles[segment.mark], overrides?.[segment.mark]]}
        >
          {segment.text}
        </Text>
      ) : (
        segment.text
      ),
    )}
  </Text>
));

MarkedText.displayName = 'MarkedText';
