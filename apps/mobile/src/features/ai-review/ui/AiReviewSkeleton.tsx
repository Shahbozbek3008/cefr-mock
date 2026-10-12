import { View } from 'react-native';
import { makeStyles, radius, space } from '@/shared/theme';
import { Bone, Card, Skeleton, TextBone } from '@/shared/ui';

const CRITERIA = 4;
const TIPS = 2;

const Criteria = () => {
  const styles = useStyles();

  return (
    <Card style={styles.list}>
      {Array.from({ length: CRITERIA }, (_, index) => (
        <View key={index} style={[styles.criterion, index < CRITERIA - 1 && styles.divider]}>
          <TextBone variant="bodySm" width={index % 2 ? '42%' : '56%'} style={styles.fill} />
          <Bone width={64} height={4} radius={radius.pill} />
          <TextBone variant="monoCallout" width={36} />
        </View>
      ))}
    </Card>
  );
};

const TextCard = ({ lines }: { lines: number }) => {
  const styles = useStyles();

  return (
    <Card style={styles.textCard}>
      <View style={styles.header}>
        <TextBone variant="bodySmMedium" width={116} />
        <TextBone variant="micro" width={84} />
      </View>
      <TextBone variant="readingSm" lines={lines} />
    </Card>
  );
};

export const WritingReviewSkeleton = () => {
  const styles = useStyles();

  return (
    <Skeleton style={styles.root}>
      <Card level="raised" radius={radius.cardLg} style={styles.hero}>
        <View style={styles.heroScore}>
          <TextBone variant="caption" width={72} />
          <Bone width={68} height={42} radius={radius.sm} />
        </View>
        <View style={styles.fill}>
          <TextBone variant="calloutMedium" width="46%" />
          <TextBone variant="callout" lines={3} />
        </View>
      </Card>
      <Criteria />
      <TextCard lines={6} />
    </Skeleton>
  );
};

export const SpeakingReviewSkeleton = () => {
  const styles = useStyles();

  return (
    <Skeleton style={styles.root}>
      <Card style={styles.playback}>
        <Bone circle={40} />
        <Bone height={32} radius={radius.xs} style={styles.fill} />
        <TextBone variant="monoSm" width={36} />
      </Card>

      <View style={styles.tiles}>
        {Array.from({ length: CRITERIA }, (_, index) => (
          <Card key={index} radius={radius.button} style={styles.tile}>
            <TextBone variant="caption" width="64%" />
            <TextBone variant="statMd" width={44} />
            <Bone height={3} radius={radius.pill} />
          </Card>
        ))}
      </View>

      <TextCard lines={5} />

      <View style={styles.tips}>
        {Array.from({ length: TIPS }, (_, index) => (
          <Card key={index} radius={radius.button} style={styles.tip}>
            <Bone circle={22} />
            <TextBone variant="calloutRelaxed" lines={2} style={styles.fill} />
          </Card>
        ))}
      </View>
    </Skeleton>
  );
};

const useStyles = makeStyles(({ colors }) => ({
  root: {
    gap: space[3.5],
  },
  hero: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[4.5],
    paddingVertical: space[4.5],
    paddingHorizontal: space[5],
  },
  heroScore: {
    gap: space[1.5],
  },
  list: {
    paddingVertical: space[1],
    paddingHorizontal: space[4],
  },
  criterion: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  textCard: {
    padding: space[4],
    gap: space[2.5],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  playback: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
    paddingVertical: space[3],
    paddingHorizontal: space[3.5],
  },
  tiles: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space[2],
  },
  tile: {
    flexBasis: '47%',
    flexGrow: 1,
    paddingVertical: space[3],
    paddingHorizontal: space[3.5],
    gap: space[1.5],
  },
  tips: {
    gap: space[2],
  },
  tip: {
    flexDirection: 'row',
    gap: space[2.5],
    paddingVertical: space[3],
    paddingHorizontal: space[3.5],
  },
  fill: {
    flex: 1,
  },
}));
