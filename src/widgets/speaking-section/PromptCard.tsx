import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Defs, Pattern, Rect } from 'react-native-svg';
import type { SpeakingQuestion } from '@/entities/test';
import { radius, space, useTheme } from '@/shared/theme';
import { Card, Text } from '@/shared/ui';

const IMAGE_HEIGHT = 170;

const Placeholder = memo<{ caption: string }>(({ caption }) => {
  const { colors } = useTheme();

  return (
    <View style={styles.image}>
      <Svg width="100%" height={IMAGE_HEIGHT} style={StyleSheet.absoluteFill}>
        <Defs>
          <Pattern id="stripes" width={20} height={20} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <Rect width={10} height={20} fill={colors.surfaceMuted} />
            <Rect x={10} width={10} height={20} fill={colors.surfaceSubtle} />
          </Pattern>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#stripes)" />
      </Svg>
      <Text variant="monoXs" color={colors.textTertiary}>
        {`rasm · ${caption}`}
      </Text>
    </View>
  );
});

Placeholder.displayName = 'ImagePlaceholder';

export const PromptCard = memo<{ question: SpeakingQuestion }>(({ question }) => {
  return (
    <Card radius={radius.cardLg} style={styles.card}>
      {question.image ? <Placeholder caption={question.image} /> : null}
      <Text variant="lead" style={styles.prompt}>
        {question.prompt}
      </Text>
    </Card>
  );
});

PromptCard.displayName = 'PromptCard';

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
  },
  image: {
    height: IMAGE_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  prompt: {
    padding: space[4],
  },
});
