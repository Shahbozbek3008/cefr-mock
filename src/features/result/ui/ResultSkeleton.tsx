import { View } from 'react-native';
import { makeStyles, radius, space } from '@/shared/theme';
import { Bone, Card, Skeleton, TextBone } from '@/shared/ui';

const SECTIONS = 4;
const ARC = 220;

export const ResultSkeleton = () => {
  const styles = useStyles();

  return (
    <Skeleton style={styles.root}>
      <Card level="strong" radius={radius.hero} style={styles.gaugeCard}>
        <View style={styles.gauge}>
          <View style={styles.arcClip}>
            <Bone circle={ARC} style={styles.arc} />
          </View>
          <View style={styles.score}>
            <Bone width={96} height={52} radius={radius.sm} />
            <TextBone variant="monoSm" width={64} />
          </View>
        </View>
        <View style={styles.tags}>
          <Bone width={132} height={28} radius={radius.pill} />
          <Bone width={52} height={28} radius={radius.pill} />
        </View>
      </Card>

      <View style={styles.grid}>
        {Array.from({ length: SECTIONS }, (_, index) => (
          <Card key={index} style={styles.sectionCard}>
            <View style={styles.row}>
              <TextBone variant="callout" width="52%" />
              <TextBone variant="monoXs" width={24} />
            </View>
            <View style={styles.row}>
              <TextBone variant="statLg" width={40} />
              <TextBone variant="monoXs" width={34} />
            </View>
            <Bone height={4} radius={radius.pill} />
          </Card>
        ))}
      </View>

      <Card style={styles.recommendation}>
        <View style={styles.fill}>
          <TextBone variant="labelMedium" width="54%" />
          <TextBone variant="callout" width="78%" />
        </View>
        <Bone width={18} height={18} radius={radius.xs} />
      </Card>
    </Skeleton>
  );
};

const useStyles = makeStyles(({ colors }) => ({
  root: {
    gap: space[3.5],
  },
  gaugeCard: {
    alignItems: 'center',
    paddingTop: space[4.5],
    paddingHorizontal: space[4.5],
    paddingBottom: space[5],
    gap: space[3],
  },
  gauge: {
    width: 300,
    height: 165,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  arcClip: {
    position: 'absolute',
    top: 20,
    width: ARC,
    height: ARC * 0.62,
    overflow: 'hidden',
  },
  arc: {
    backgroundColor: 'transparent',
    borderWidth: 12,
    borderColor: colors.skeleton,
  },
  score: {
    alignItems: 'center',
    gap: space[1.5],
    paddingBottom: space[1],
  },
  tags: {
    flexDirection: 'row',
    gap: space[2],
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space[2.5],
  },
  sectionCard: {
    flexBasis: '47%',
    flexGrow: 1,
    padding: space[3.5],
    gap: space[3],
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recommendation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
    paddingVertical: space[3.5],
    paddingHorizontal: space[4],
  },
  fill: {
    flex: 1,
    gap: space[0.5],
  },
}));
