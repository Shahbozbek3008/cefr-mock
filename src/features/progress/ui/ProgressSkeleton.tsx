import { View } from 'react-native';
import { makeStyles, radius, space } from '@/shared/theme';
import { Bone, Card, Skeleton, TextBone } from '@/shared/ui';

const AXIS = 5;
const SECTIONS = 4;
const HISTORY = 2;
const CHART_HEIGHT = 136;
const BARS = [0.42, 0.5, 0.46, 0.6, 0.58, 0.72, 0.68, 0.82];

export const ProgressSkeleton = () => {
  const styles = useStyles();

  return (
    <Skeleton style={styles.root}>
      <Card level="strong" radius={radius.cardLg} style={styles.chartCard}>
        <View style={styles.chartTop}>
          <View style={styles.summary}>
            <TextBone variant="callout" width={86} />
            <View style={styles.valueRow}>
              <Bone width={64} height={30} radius={radius.xs} />
              <Bone width={36} height={22} radius={radius.tag} />
            </View>
          </View>
          <TextBone variant="monoXs" width={46} />
        </View>
        <View style={styles.chart}>
          {BARS.map((value, index) => (
            <Bone key={index} height={CHART_HEIGHT * value} radius={radius.xs} style={styles.bar} />
          ))}
        </View>
        <View style={styles.axis}>
          {Array.from({ length: AXIS }, (_, index) => (
            <TextBone key={index} variant="monoNano" width={28} />
          ))}
        </View>
      </Card>

      <Card style={styles.listCard}>
        <View style={styles.listHeader}>
          <TextBone variant="bodySmMedium" width={80} />
          <TextBone variant="caption" width={72} />
        </View>
        {Array.from({ length: SECTIONS }, (_, index) => (
          <View key={index} style={[styles.sectionRow, index < SECTIONS - 1 && styles.divider]}>
            <TextBone variant="bodySm" width={index % 2 ? '44%' : '52%'} style={styles.fill} />
            <Bone width={90} height={4} radius={radius.pill} />
            <TextBone variant="monoCallout" width={44} />
          </View>
        ))}
      </Card>

      <View style={styles.historyHeader}>
        <TextBone variant="labelMedium" width={52} />
        <TextBone variant="calloutMedium" width={60} />
      </View>
      <Card style={styles.listCard}>
        {Array.from({ length: HISTORY }, (_, index) => (
          <View key={index} style={[styles.historyRow, index > 0 && styles.dividerTop]}>
            <TextBone variant="monoXs" width={36} />
            <TextBone variant="bodySm" width="46%" style={styles.fill} />
            <TextBone variant="mono" width={22} />
            <Bone width={30} height={22} radius={radius.tag} />
          </View>
        ))}
      </Card>
    </Skeleton>
  );
};

const useStyles = makeStyles(({ colors }) => ({
  root: {
    gap: space[3.5],
  },
  chartCard: {
    paddingTop: space[4.5],
    paddingHorizontal: space[4.5],
    paddingBottom: space[3],
    gap: space[2.5],
  },
  chartTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  summary: {
    gap: space[1.5],
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2],
  },
  chart: {
    height: CHART_HEIGHT,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: space[2],
  },
  bar: {
    flex: 1,
    opacity: 0.7,
  },
  axis: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: space[1],
  },
  listCard: {
    paddingHorizontal: space[4],
    paddingVertical: space[1],
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: space[2],
    paddingBottom: space[1],
  },
  sectionRow: {
    height: 46,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: space[1.5],
    paddingHorizontal: space[1],
  },
  historyRow: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  dividerTop: {
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  fill: {
    flex: 1,
  },
}));
