import { memo, useCallback, useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { hitSlop, makeStyles, radius, useTheme } from '@/shared/theme';
import { Card, Text } from '@/shared/ui';
import { buildMonthGrid, isOfficialExamDay, monthLabels, weekdayLabels } from '../model/calendar';

export type CalendarProps = {
  value: string | null;
  onChange: (iso: string) => void;
};

export const Calendar = memo<CalendarProps>(({ value, onChange }) => {
  const styles = useStyles();
  const { colors, elevation } = useTheme();
  const initial = useMemo(() => (value ? new Date(`${value}T00:00:00`) : new Date()), [value]);
  const [year, setYear] = useState(initial.getFullYear());
  const [month, setMonth] = useState(initial.getMonth());

  const cells = useMemo(() => buildMonthGrid(year, month), [year, month]);

  const goPrev = useCallback(() => {
    setMonth((prev) => {
      if (prev === 0) {
        setYear((y) => y - 1);
        return 11;
      }
      return prev - 1;
    });
  }, []);

  const goNext = useCallback(() => {
    setMonth((prev) => {
      if (prev === 11) {
        setYear((y) => y + 1);
        return 0;
      }
      return prev + 1;
    });
  }, []);

  return (
    <Card level="raised" radius={radius.cardLg} style={styles.card}>
      <View style={styles.header}>
        <Text variant="titleSm">{`${monthLabels[month]} ${year}`}</Text>
        <View style={styles.nav}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Oldingi oy"
            hitSlop={hitSlop}
            onPress={goPrev}
            style={styles.navButton}
          >
            <ChevronLeft size={15} color={colors.textSecondary} strokeWidth={1.75} />
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Keyingi oy"
            hitSlop={hitSlop}
            onPress={goNext}
            style={styles.navButton}
          >
            <ChevronRight size={15} color={colors.textSecondary} strokeWidth={1.75} />
          </Pressable>
        </View>
      </View>

      <View style={styles.grid}>
        {weekdayLabels.map((label) => (
          <View key={label} style={styles.weekday}>
            <Text variant="micro" color={colors.textTertiary}>
              {label}
            </Text>
          </View>
        ))}

        {cells.map((cell, index) => {
          if (cell.day === null || cell.iso === null) {
            return <View key={`empty-${index}`} style={styles.cell} />;
          }

          const iso = cell.iso;
          const selected = value === iso;
          const official = isOfficialExamDay(iso);

          return (
            <Pressable
              key={iso}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              accessibilityLabel={`${cell.day}-${monthLabels[month]}`}
              onPress={() => onChange(iso)}
              style={styles.cell}
            >
              <View style={styles.dayWrap}>
                {selected ? (
                  <LinearGradient
                    colors={colors.actionGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={[styles.daySelected, elevation.actionSm]}
                  />
                ) : null}
                <Text variant="mono" color={selected ? colors.onAction : colors.text} style={styles.dayText}>
                  {cell.day}
                </Text>
                {official && !selected ? <View style={styles.dot} /> : null}
              </View>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.legend}>
        <View style={styles.dotStatic} />
        <Text variant="caption" color={colors.textSecondary}>
          Rasmiy imtihon kunlari
        </Text>
      </View>
    </Card>
  );
});

Calendar.displayName = 'Calendar';

const useStyles = makeStyles(({ colors }) => ({
  card: {
    padding: 18,
    gap: 14,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  nav: {
    flexDirection: 'row',
    gap: 6,
  },
  navButton: {
    width: 32,
    height: 32,
    borderRadius: radius.sm,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 4,
  },
  weekday: {
    width: `${100 / 7}%`,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cell: {
    width: `${100 / 7}%`,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayWrap: {
    width: 38,
    height: 38,
    borderRadius: radius.input,
    alignItems: 'center',
    justifyContent: 'center',
  },
  daySelected: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: radius.input,
  },
  dayText: {
    textAlign: 'center',
  },
  dot: {
    position: 'absolute',
    bottom: 4,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.dataSoft,
  },
  dotStatic: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.dataSoft,
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
}));
