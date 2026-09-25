import { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { light, radius, space } from '@/shared/theme';
import { Button, Sheet, Text } from '@/shared/ui';
import type { SectionStats } from '../model/stats';

export type FinishSheetProps = {
  visible: boolean;
  title: string;
  message: string;
  stats?: SectionStats;
  loading?: boolean;
  onReview: (number: number) => void;
  onFinish: () => void;
  onClose: () => void;
};

const Legend = ({ color, value, label }: { color: string; value: number; label: string }) => (
  <View style={styles.legendItem}>
    <View style={[styles.swatch, { backgroundColor: color }]} />
    <Text variant="monoCallout">{value}</Text>
    <Text variant="callout" color={light.textSecondary}>
      {label}
    </Text>
  </View>
);

const NumberCell = ({ number, tone, onPress }: { number: number; tone: 'error' | 'warning'; onPress: () => void }) => (
  <Pressable
    accessibilityRole="button"
    accessibilityLabel={`Savol ${number}`}
    onPress={onPress}
    style={[styles.cell, tone === 'error' ? styles.cellError : styles.cellWarning]}
  >
    <Text variant="monoCallout" color={tone === 'error' ? light.error.text : light.warning.text}>
      {number}
    </Text>
  </Pressable>
);

export const FinishSheet = memo<FinishSheetProps>(
  ({ visible, title, message, stats, loading = false, onReview, onFinish, onClose }) => {
    const firstPending = stats?.emptyNumbers[0] ?? stats?.flaggedNumbers[0];
    const hasPending = firstPending !== undefined;
    const segments = stats
      ? [
          { value: stats.answered, color: light.data },
          { value: stats.flagged, color: light.warning[500] },
          { value: stats.empty, color: light.error[500] },
        ].filter((segment) => segment.value > 0)
      : [];

    return (
      <Sheet visible={visible} onClose={onClose}>
        <View style={styles.intro}>
          <Text variant="titleSheet">{title}</Text>
          <Text variant="labelRelaxed" color={light.textSecondary}>
            {message}
          </Text>
        </View>

        {stats ? (
          <View style={styles.stats}>
            <View style={styles.bar}>
              {segments.map((segment) => (
                <View
                  key={segment.color}
                  style={[styles.segment, { flex: segment.value, backgroundColor: segment.color }]}
                />
              ))}
            </View>
            <View style={styles.legend}>
              <Legend color={light.data} value={stats.answered} label="javob" />
              <Legend color={light.warning[500]} value={stats.flagged} label="belgilangan" />
              <Legend color={light.error[500]} value={stats.empty} label="javobsiz" />
            </View>
          </View>
        ) : null}

        {hasPending ? (
          <View style={styles.cells}>
            {stats?.emptyNumbers.map((n) => (
              <NumberCell key={`e${n}`} number={n} tone="error" onPress={() => onReview(n)} />
            ))}
            {stats?.flaggedNumbers.map((n) => (
              <NumberCell key={`f${n}`} number={n} tone="warning" onPress={() => onReview(n)} />
            ))}
          </View>
        ) : null}

        <View style={styles.actions}>
          {hasPending ? (
            <Button
              label={stats?.empty ? 'Javobsizlarga qaytish' : 'Belgilanganlarga qaytish'}
              trailingText={String(stats?.empty || stats?.flagged)}
              size="M"
              onPress={() => onReview(firstPending)}
            />
          ) : null}
          <Button
            label={hasPending ? 'Baribir yakunlash' : 'Yakunlash'}
            variant={hasPending ? 'muted' : 'primary'}
            size="M"
            loading={loading}
            onPress={onFinish}
          />
        </View>
      </Sheet>
    );
  },
);

FinishSheet.displayName = 'FinishSheet';

const styles = StyleSheet.create({
  intro: {
    gap: space[2],
    paddingHorizontal: space[1],
  },
  stats: {
    gap: space[2.5],
    paddingHorizontal: space[1],
  },
  bar: {
    height: 8,
    flexDirection: 'row',
    gap: 2,
    borderRadius: 4,
    overflow: 'hidden',
  },
  segment: {
    height: '100%',
  },
  legend: {
    flexDirection: 'row',
    gap: space[4],
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[1.5],
  },
  swatch: {
    width: 8,
    height: 8,
    borderRadius: 2,
  },
  cells: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space[1.5],
    paddingHorizontal: space[1],
  },
  cell: {
    width: 48,
    height: 44,
    borderRadius: radius.input,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellError: {
    backgroundColor: light.error.bg,
    borderColor: light.error.border,
  },
  cellWarning: {
    backgroundColor: light.warning.bg,
    borderColor: light.warning.border,
  },
  actions: {
    gap: space[2],
  },
});
