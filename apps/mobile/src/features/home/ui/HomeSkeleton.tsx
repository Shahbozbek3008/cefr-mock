import { View } from 'react-native';
import { makeStyles, radius, space } from '@/shared/theme';
import { Bone, Card, Skeleton, TextBone } from '@/shared/ui';

const COLUMNS = 4;

export const ExamHeroSkeleton = () => {
  const styles = useStyles();

  return (
    <Skeleton>
      <Card level="raised" radius={radius.hero} style={styles.hero}>
        <View style={styles.heroTop}>
          <View style={styles.countdown}>
            <TextBone variant="callout" width={92} />
            <View style={styles.days}>
              <Bone width={76} height={42} radius={radius.sm} />
              <TextBone variant="body" width={30} />
            </View>
          </View>
          <Bone width={96} height={30} radius={radius.pill} />
        </View>
        <View style={styles.level}>
          <View style={styles.levelRow}>
            <TextBone variant="caption" width={116} />
            <TextBone variant="caption" width={72} />
          </View>
          <Bone height={6} radius={radius.pill} />
        </View>
      </Card>
    </Skeleton>
  );
};

export const SectionsOverviewSkeleton = () => {
  const styles = useStyles();

  return (
    <Skeleton>
      <Card radius={radius.cardLg}>
        <View style={styles.overviewHeader}>
          <TextBone variant="labelMedium" width={84} />
          <TextBone variant="caption" width={88} />
        </View>
        <View style={styles.grid}>
          {Array.from({ length: COLUMNS }, (_, index) => (
            <View key={index} style={[styles.column, index === 0 ? styles.first : styles.rest]}>
              <Bone width={32} height={32} radius={radius.sm} />
              <View style={styles.stat}>
                <TextBone variant="statMd" width="70%" />
                <TextBone variant="micro" width="85%" />
              </View>
              <Bone height={4} radius={radius.pill} />
            </View>
          ))}
        </View>
      </Card>
    </Skeleton>
  );
};

const useStyles = makeStyles(({ colors }) => ({
  hero: {
    paddingVertical: space[4.5],
    paddingHorizontal: space[5],
    gap: space[3.5],
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  countdown: {
    gap: space[2],
  },
  days: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: space[2],
  },
  level: {
    gap: space[2],
  },
  levelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  overviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: space[3.5],
    paddingHorizontal: space[4],
    paddingBottom: space[0.5],
  },
  grid: {
    flexDirection: 'row',
  },
  column: {
    flex: 1,
    gap: space[2.5],
    paddingTop: space[3],
    paddingRight: space[2.5],
    paddingBottom: space[3.5],
  },
  first: {
    paddingLeft: space[3.5],
  },
  rest: {
    paddingLeft: space[3],
    borderLeftWidth: 1,
    borderLeftColor: colors.divider,
  },
  stat: {
    gap: 3,
  },
}));
