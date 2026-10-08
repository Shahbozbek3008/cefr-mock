import { View } from 'react-native';
import { makeStyles, radius, space } from '@/shared/theme';
import { Bone, Card, Skeleton, TextBone } from '@/shared/ui';

const ROWS = 3;
const SECTION_TAGS = [64, 58, 52, 62];

export const TestListSkeleton = () => {
  const styles = useStyles();

  return (
    <Skeleton style={styles.root}>
      <Card level="raised" style={styles.featured}>
        <View style={styles.featuredTop}>
          <View style={styles.featuredInfo}>
            <View style={styles.tags}>
              <Bone width={44} height={22} radius={radius.tag} />
              <Bone width={48} height={22} radius={radius.tag} />
            </View>
            <TextBone variant="heading" width="62%" style={styles.title} />
            <TextBone variant="callout" width="48%" />
          </View>
          <TextBone variant="monoSm" width={44} />
        </View>
        <View style={styles.tags}>
          {SECTION_TAGS.map((width) => (
            <Bone key={width} width={width} height={24} radius={radius.chip} />
          ))}
        </View>
      </Card>

      {Array.from({ length: ROWS }, (_, index) => (
        <Card key={index} style={styles.row}>
          <Bone width={44} height={44} radius={radius.md} />
          <View style={styles.rowBody}>
            <TextBone variant="titleSm" width={index % 2 ? '52%' : '64%'} />
            <TextBone variant="callout" width={index % 2 ? '70%' : '58%'} />
          </View>
          <Bone
            width={index === 0 ? 64 : 18}
            height={index === 0 ? 36 : 18}
            radius={index === 0 ? radius.sm : radius.xs}
          />
        </Card>
      ))}
    </Skeleton>
  );
};

const useStyles = makeStyles(() => ({
  root: {
    gap: space[2.5],
  },
  featured: {
    padding: space[4],
    gap: space[3],
  },
  featuredTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  featuredInfo: {
    flex: 1,
    gap: space[1],
  },
  title: {
    marginTop: space[1.5],
  },
  tags: {
    flexDirection: 'row',
    gap: space[1.5],
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3.5],
    paddingVertical: space[3.5],
    paddingHorizontal: space[4],
  },
  rowBody: {
    flex: 1,
    gap: space[0.5],
  },
}));
