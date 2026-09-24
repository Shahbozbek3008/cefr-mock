import { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Calendar } from 'lucide-react-native';
import { formatDayMonth, levelFor } from '@/shared/lib';
import { elevation, light, palette, radius, space } from '@/shared/theme';
import { HeroSurface, Text } from '@/shared/ui';
import { LevelBar } from './LevelBar';

export type ExamHeroProps = {
  daysLeft: number | null;
  examDate: string | null;
  score: number;
  target: string | null;
  onDatePress: () => void;
};

export const ExamHero = memo<ExamHeroProps>(({ daysLeft, examDate, score, target, onDatePress }) => (
  <HeroSurface style={[styles.card, elevation.hero]}>
    <View style={[styles.ring, styles.ringLarge]} />
    <View style={[styles.ring, styles.ringSmall]} />

    <View style={styles.top}>
      <View style={styles.countdown}>
        <Text variant="callout" color={light.onHeroMuted}>
          Imtihongacha
        </Text>
        <View style={styles.days}>
          <Text variant="display" color={light.onHero}>
            {daysLeft ?? '—'}
          </Text>
          <Text variant="body" color={palette.white.a80}>
            kun
          </Text>
        </View>
      </View>

      <Pressable accessibilityRole="button" onPress={onDatePress} style={styles.datePill}>
        <Calendar size={13} color={light.onHero} strokeWidth={1.75} />
        <Text variant="captionMedium" color={light.onHero}>
          {examDate ? formatDayMonth(examDate) : 'Sana tanlash'}
        </Text>
      </Pressable>
    </View>

    <View style={styles.level}>
      <View style={styles.levelRow}>
        <Text variant="caption" color={light.onHeroMuted}>
          Joriy daraja{' '}
          <Text variant="captionMedium" color={light.onHero}>
            {`${score} · ${levelFor(score)}`}
          </Text>
        </Text>
        <Text variant="caption" color={light.onHeroMuted}>
          Maqsad{' '}
          <Text variant="captionMedium" color={light.onHero}>
            {target ?? '—'}
          </Text>
        </Text>
      </View>
      <LevelBar score={score} />
    </View>
  </HeroSurface>
));

ExamHero.displayName = 'ExamHero';

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.hero,
    paddingVertical: space[4.5],
    paddingHorizontal: space[5],
    gap: space[3.5],
    overflow: 'hidden',
  },
  ring: {
    position: 'absolute',
    borderWidth: 1,
  },
  ringLarge: {
    right: -60,
    top: -70,
    width: 220,
    height: 220,
    borderRadius: 110,
    borderColor: palette.white.a10,
  },
  ringSmall: {
    right: -10,
    top: -20,
    width: 120,
    height: 120,
    borderRadius: 60,
    borderColor: palette.white.a08,
  },
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  countdown: {
    gap: space[1.5],
  },
  days: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: space[1.5],
  },
  datePill: {
    height: 30,
    paddingHorizontal: 11,
    borderRadius: radius.pill,
    backgroundColor: palette.white.a14,
    borderWidth: 1,
    borderColor: palette.white.a16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[1.5],
  },
  level: {
    gap: space[2],
  },
  levelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
