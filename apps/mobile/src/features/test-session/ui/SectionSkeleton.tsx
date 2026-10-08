import { View } from 'react-native';
import { makeStyles, radius, size, space } from '@/shared/theme';
import { Bone, Card, Skeleton, TextBone } from '@/shared/ui';

const SEGMENTS = 4;
const QUESTIONS = 3;

export const SectionSkeleton = () => {
  const styles = useStyles();

  return (
    <Skeleton style={styles.root}>
      <View style={styles.bar}>
        <Bone circle={size.iconButton} />
        <View style={styles.center}>
          <TextBone variant="bodySmMedium" width={96} />
          <View style={styles.segments}>
            {Array.from({ length: SEGMENTS }, (_, index) => (
              <Bone key={index} height={3} radius={radius.pill} style={styles.fill} />
            ))}
          </View>
        </View>
        <Bone width={84} height={32} radius={radius.pill} />
      </View>

      <Card style={styles.card}>
        <TextBone variant="monoLabel" width={88} />
        <TextBone variant="titleMd" width="72%" />
        <TextBone variant="bodySmRelaxed" lines={2} />
      </Card>

      <Card style={styles.card}>
        <View style={styles.row}>
          <Bone circle={44} />
          <Bone height={36} radius={radius.xs} style={styles.fill} />
        </View>
        <Bone height={4} radius={radius.pill} />
      </Card>

      {Array.from({ length: QUESTIONS }, (_, index) => (
        <View key={index} style={styles.question}>
          <Bone width={28} height={28} radius={radius.sm} />
          <View style={styles.questionBody}>
            <TextBone variant="label" width={index % 2 ? '64%' : '82%'} />
            <Bone height={size.field} radius={radius.input} />
          </View>
        </View>
      ))}
    </Skeleton>
  );
};

const useStyles = makeStyles(() => ({
  root: {
    gap: space[3.5],
  },
  bar: {
    height: size.headerBar,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
  },
  center: {
    flex: 1,
    alignItems: 'center',
    gap: space[1.5],
  },
  segments: {
    width: '80%',
    flexDirection: 'row',
    gap: space[1],
  },
  card: {
    padding: space[4],
    gap: space[2],
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
  },
  question: {
    flexDirection: 'row',
    gap: space[3],
    paddingHorizontal: space[1],
  },
  questionBody: {
    flex: 1,
    gap: space[2],
  },
  fill: {
    flex: 1,
  },
}));
