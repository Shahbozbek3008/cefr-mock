import { memo } from 'react';
import { TextStyle } from 'react-native';
import type { TextSegment } from '@/entities/result';
import { Colors, useTheme } from '@/shared/theme';
import { Text } from '@/shared/ui';

type Mark = NonNullable<TextSegment['mark']>;

const underline = (background: string, line: string): TextStyle => ({
  backgroundColor: background,
  textDecorationLine: 'underline',
  textDecorationColor: line,
});

const markStyle = (colors: Colors, mark: Mark, grammarTone: 'error' | 'warning'): TextStyle =>
  ({
    grammar: underline(colors[grammarTone].bg, colors[grammarTone][500]),
    lexis: underline(colors.warning.bg, colors.warning[500]),
    filler: { color: colors.textTertiary },
    good: underline(colors.chipActiveBg, colors.data),
  })[mark];

export type MarkedTextProps = {
  segments: TextSegment[];
  grammarTone?: 'error' | 'warning';
  onMarkPress?: (text: string) => void;
};

export const MarkedText = memo<MarkedTextProps>(({ segments, grammarTone = 'error', onMarkPress }) => {
  const { colors } = useTheme();

  return (
    <Text variant="readingSm" color={colors.textReading}>
      {segments.map((segment, index) =>
        segment.mark ? (
          <Text
            key={index}
            variant="readingSm"
            color={colors.textReading}
            suppressHighlighting
            onPress={onMarkPress ? () => onMarkPress(segment.text) : undefined}
            style={markStyle(colors, segment.mark, grammarTone)}
          >
            {segment.text}
          </Text>
        ) : (
          segment.text
        ),
      )}
    </Text>
  );
});

MarkedText.displayName = 'MarkedText';
