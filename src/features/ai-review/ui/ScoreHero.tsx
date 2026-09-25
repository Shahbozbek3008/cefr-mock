import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Sparkles } from 'lucide-react-native';
import { MAX_SCORE } from '@/shared/lib';
import { elevation, light, palette, radius, space } from '@/shared/theme';
import { HeroSurface, Text } from '@/shared/ui';

export type ScoreHeroProps = {
  label: string;
  score: number;
  verdict: string;
  summary: string;
};

export const ScoreHero = memo<ScoreHeroProps>(({ label, score, verdict, summary }) => (
  <HeroSurface style={[styles.card, elevation.hero]}>
    <View style={styles.score}>
      <Text variant="caption" color={light.onHeroMuted}>
        {label}
      </Text>
      <View style={styles.value}>
        <Text variant="displayMd" color={light.onHero}>
          {score}
        </Text>
        <Text variant="monoCallout" color={palette.white.a60}>
          {`/${MAX_SCORE}`}
        </Text>
      </View>
    </View>
    <View style={styles.body}>
      <View style={styles.verdict}>
        <Sparkles size={14} color={light.onHero} strokeWidth={1.6} />
        <Text variant="calloutMedium" color={light.onHero}>
          {verdict}
        </Text>
      </View>
      <Text variant="callout" color={palette.white.a88}>
        {summary}
      </Text>
    </View>
  </HeroSurface>
));

ScoreHero.displayName = 'ScoreHero';

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.cardLg,
    paddingVertical: space[4.5],
    paddingHorizontal: space[5],
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[4.5],
  },
  score: {
    gap: space[1],
  },
  value: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: space[1.5],
  },
  body: {
    flex: 1,
    gap: space[1.5],
  },
  verdict: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[1.5],
  },
});
