import { memo } from 'react';
import { View } from 'react-native';
import { listeningAudioUrl } from '@/entities/test';
import { makeStyles, space, useTheme } from '@/shared/theme';
import { Card, Text } from '@/shared/ui';
import type { PracticeItem } from '../model/practice';
import { AudioClip } from './AudioClip';

export const PracticeContext = memo<{ item: PracticeItem }>(({ item }) => {
  const styles = useStyles();
  const { colors } = useTheme();

  if (item.section === 'listening') {
    const { part, startSec, endSec } = item;
    return (
      <Card style={styles.card}>
        <Text variant="calloutRelaxed" color={colors.textSecondary}>
          {part.instruction}
        </Text>
        {part.audio && startSec !== undefined && endSec !== undefined ? (
          <AudioClip uri={listeningAudioUrl(part.audio)} startSec={startSec} endSec={endSec} />
        ) : null}
      </Card>
    );
  }

  return (
    <Card style={styles.card}>
      <Text variant="heading">{item.part.title}</Text>
      {item.part.passage.map((paragraph) => (
        <View key={paragraph.label} style={styles.paragraph}>
          <Text variant="monoXs" color={colors.textTertiary} style={styles.label}>
            {paragraph.label}
          </Text>
          <Text variant="bodySmRelaxed" color={colors.textReading} style={styles.text}>
            {paragraph.text}
          </Text>
        </View>
      ))}
    </Card>
  );
});

PracticeContext.displayName = 'PracticeContext';

const useStyles = makeStyles(() => ({
  card: {
    padding: space[4],
    gap: space[3],
  },
  paragraph: {
    flexDirection: 'row',
    gap: space[2.5],
  },
  label: {
    width: 14,
    paddingTop: space[1],
  },
  text: {
    flex: 1,
  },
}));
