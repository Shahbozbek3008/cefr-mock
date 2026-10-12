import { View } from 'react-native';
import { makeStyles, radius, space } from '@/shared/theme';
import { Bone, Card, Skeleton, TextBone } from '@/shared/ui';

const groups = [3, 2];

export const NotificationsSkeleton = () => {
  const styles = useStyles();

  return (
    <Skeleton style={styles.root}>
      {groups.map((rows, group) => (
        <View key={group} style={styles.group}>
          <TextBone variant="caption" width={group === 0 ? 48 : 72} style={styles.label} />
          <Card style={styles.card}>
            {Array.from({ length: rows }, (_, index) => (
              <View key={index} style={styles.row}>
                <Bone width={40} height={40} radius={radius.md} />
                <View style={[styles.body, index < rows - 1 && styles.divider]}>
                  <View style={styles.line}>
                    <TextBone variant="bodySmMedium" width={index % 2 ? '58%' : '72%'} style={styles.fill} />
                    <TextBone variant="monoXs" width={34} />
                  </View>
                  <TextBone variant="callout" lines={2} />
                </View>
              </View>
            ))}
          </Card>
        </View>
      ))}
    </Skeleton>
  );
};

const useStyles = makeStyles(({ colors }) => ({
  root: {
    gap: space[5],
  },
  group: {
    gap: space[2],
  },
  label: {
    paddingHorizontal: space[1],
  },
  card: {
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: space[3],
    paddingLeft: space[4],
    paddingTop: space[3.5],
  },
  body: {
    flex: 1,
    gap: space[1],
    paddingBottom: space[3.5],
    paddingRight: space[4],
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  line: {
    flexDirection: 'row',
    gap: space[3],
  },
  fill: {
    flex: 1,
  },
}));
