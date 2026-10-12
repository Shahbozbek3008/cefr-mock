import { View } from 'react-native';
import { makeStyles, radius, space } from '@/shared/theme';
import { Bone, Card, Skeleton, TextBone } from '@/shared/ui';

const COLUMNS = 6;
const ROWS = 3;
const SUMMARY = [72, 52, 76];

export const ReviewSkeleton = () => {
  const styles = useStyles();

  return (
    <Skeleton style={styles.root}>
      <View style={styles.summary}>
        {SUMMARY.map((width) => (
          <TextBone key={width} variant="callout" width={width} />
        ))}
      </View>

      <Card style={styles.grid}>
        {Array.from({ length: ROWS }, (_, row) => (
          <View key={row} style={styles.gridRow}>
            {Array.from({ length: COLUMNS }, (_, column) => (
              <Bone key={column} height={40} radius={radius.input} style={styles.cell} />
            ))}
          </View>
        ))}
      </Card>

      <Card level="strong" style={styles.detail}>
        <View style={styles.header}>
          <Bone width={112} height={26} radius={radius.tag} />
          <Bone width={96} height={26} radius={radius.pill} />
        </View>
        <TextBone variant="labelRelaxed" lines={2} />
        <View style={styles.answers}>
          <Bone height={58} radius={radius.md} style={styles.cell} />
          <Bone height={58} radius={radius.md} style={styles.cell} />
        </View>
        <View style={styles.explanation}>
          <Bone width={15} height={15} radius={radius.xxs} />
          <TextBone variant="calloutRelaxed" lines={3} style={styles.fill} />
        </View>
      </Card>
    </Skeleton>
  );
};

const useStyles = makeStyles(({ colors }) => ({
  root: {
    gap: space[3.5],
  },
  summary: {
    flexDirection: 'row',
    gap: space[4],
    paddingHorizontal: space[1],
  },
  grid: {
    padding: space[3.5],
    gap: space[1.5],
  },
  gridRow: {
    flexDirection: 'row',
    gap: space[1.5],
  },
  cell: {
    flex: 1,
  },
  detail: {
    padding: space[4],
    gap: space[3.5],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  answers: {
    flexDirection: 'row',
    gap: space[2],
  },
  explanation: {
    flexDirection: 'row',
    gap: space[2.5],
    paddingTop: space[3],
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  fill: {
    flex: 1,
  },
}));
