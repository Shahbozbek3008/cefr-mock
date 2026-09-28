import { memo } from 'react';
import { View } from 'react-native';
import { ChartLine } from 'lucide-react-native';
import { useI18n } from '@/shared/i18n';
import { makeStyles, radius, space, useTheme } from '@/shared/theme';
import { Button, Text } from '@/shared/ui';

const ART = 132;
const DISC = 96;

export type ProgressEmptyProps = {
  onStart: () => void;
};

export const ProgressEmpty = memo<ProgressEmptyProps>(({ onStart }) => {
  const styles = useStyles();
  const { colors, elevation } = useTheme();
  const { t } = useI18n();

  return (
    <View style={styles.root}>
      <View style={styles.art}>
        <View style={styles.halo} />
        <View style={[styles.disc, elevation.card]}>
          <View style={styles.tile}>
            <ChartLine size={26} color={colors.data} strokeWidth={1.6} />
          </View>
        </View>
      </View>

      <View style={styles.copy}>
        <Text variant="titleMd" style={styles.center}>
          {t('progress.emptyTitle')}
        </Text>
        <Text variant="bodySmRelaxed" color={colors.textSecondary} style={styles.center}>
          {t('progress.emptyMessage')}
        </Text>
      </View>

      <Button label={t('progress.emptyAction')} variant="soft" size="S" onPress={onStart} />
    </View>
  );
});

ProgressEmpty.displayName = 'ProgressEmpty';

const useStyles = makeStyles(({ colors }) => ({
  root: {
    alignItems: 'center',
    gap: space[6],
    paddingTop: space[12],
    paddingHorizontal: space[6],
  },
  art: {
    width: ART,
    height: ART,
    alignItems: 'center',
    justifyContent: 'center',
  },
  halo: {
    position: 'absolute',
    width: ART,
    height: ART,
    borderRadius: ART / 2,
    backgroundColor: colors.surfaceSubtle,
    opacity: 0.6,
  },
  disc: {
    width: DISC,
    height: DISC,
    borderRadius: DISC / 2,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tile: {
    width: 56,
    height: 56,
    borderRadius: radius.lg,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: {
    gap: space[2],
    maxWidth: 300,
  },
  center: {
    textAlign: 'center',
  },
}));
