import { View } from 'react-native';
import { makeStyles, radius, space } from '@/shared/theme';
import { Bone, Card, Skeleton, TextBone } from '@/shared/ui';

const STATS = 3;
const SECTIONS = 4;
const RULES = 2;

export const TestIntroSkeleton = () => {
  const styles = useStyles();

  return (
    <Skeleton style={styles.root}>
      <View style={styles.intro}>
        <View style={styles.tags}>
          <Bone width={86} height={22} radius={radius.tag} />
          <Bone width={78} height={22} radius={radius.tag} />
        </View>
        <TextBone variant="titleXl" width="58%" />
        <TextBone variant="bodySm" width="46%" />
      </View>

      <Card radius={radius.xl} style={styles.stats}>
        {Array.from({ length: STATS }, (_, index) => (
          <View key={index} style={[styles.stat, index > 0 && styles.statDivider]}>
            <TextBone variant="monoMd" width={48} />
            <TextBone variant="caption" width={36} />
          </View>
        ))}
      </Card>

      <Card style={styles.sections}>
        {Array.from({ length: SECTIONS }, (_, index) => (
          <View key={index} style={[styles.sectionRow, index < SECTIONS - 1 && styles.divider]}>
            <Bone width={36} height={36} radius={radius.tile} />
            <View style={styles.fill}>
              <TextBone variant="labelMedium" width={index % 2 ? '44%' : '52%'} />
              <TextBone variant="caption" width="62%" />
            </View>
            <TextBone variant="monoCallout" width={40} />
          </View>
        ))}
      </Card>

      <View style={styles.rules}>
        <TextBone variant="calloutMedium" width={72} />
        {Array.from({ length: RULES }, (_, index) => (
          <View key={index} style={styles.rule}>
            <Bone width={15} height={15} radius={radius.xxs} />
            <TextBone variant="callout" lines={2} style={styles.fill} />
          </View>
        ))}
      </View>
    </Skeleton>
  );
};

const useStyles = makeStyles(({ colors }) => ({
  root: {
    gap: space[4],
  },
  intro: {
    gap: space[2],
    paddingHorizontal: space[1],
  },
  tags: {
    flexDirection: 'row',
    gap: space[1.5],
  },
  stats: {
    flexDirection: 'row',
    paddingVertical: space[3.5],
  },
  stat: {
    flex: 1,
    gap: space[0.5],
    paddingHorizontal: space[4],
  },
  statDivider: {
    borderLeftWidth: 1,
    borderLeftColor: colors.divider,
  },
  sections: {
    paddingVertical: space[1],
    paddingHorizontal: space[4],
  },
  sectionRow: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3.5],
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  rules: {
    gap: space[2.5],
    paddingHorizontal: space[1],
  },
  rule: {
    flexDirection: 'row',
    gap: space[2.5],
  },
  fill: {
    flex: 1,
  },
}));
