import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import type { Question } from '@/entities/test';
import { useI18n } from '@/shared/i18n';
import { space, useTheme } from '@/shared/theme';
import { Button, Sheet, Text } from '@/shared/ui';
import { QuestionCell } from './QuestionCell';

export type QuestionGridSheetProps = {
  visible: boolean;
  questions: Question[];
  currentId: string;
  onSelect: (id: string) => void;
  onFinish: () => void;
  onClose: () => void;
};

export const QuestionGridSheet = memo<QuestionGridSheetProps>(
  ({ visible, questions, currentId, onSelect, onFinish, onClose }) => {
    const { colors } = useTheme();
    const { t } = useI18n();
    const legend = [
      { label: t('session.legendAnswered'), color: colors.chipActiveBg },
      { label: t('session.legendCurrent'), color: colors.action },
      { label: t('session.legendFlagged'), color: colors.warning[500] },
    ];

    return (
      <Sheet visible={visible} onClose={onClose}>
        <View style={styles.header}>
          <Text variant="titleSheet">{t('session.questions')}</Text>
          <View style={styles.legend}>
            {legend.map((item) => (
              <View key={item.label} style={styles.legendItem}>
                <View style={[styles.swatch, { backgroundColor: item.color }]} />
                <Text variant="caption" color={colors.textSecondary}>
                  {item.label}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.grid}>
          {questions.map((q) => (
            <QuestionCell
              key={q.id}
              id={q.id}
              number={q.number}
              current={q.id === currentId}
              size="md"
              onPress={onSelect}
            />
          ))}
        </View>

        <Button label={t('session.finishSection')} variant="muted" size="M" onPress={onFinish} />
      </Sheet>
    );
  },
);

QuestionGridSheet.displayName = 'QuestionGridSheet';

const styles = StyleSheet.create({
  header: {
    gap: space[3],
    paddingHorizontal: space[1],
  },
  legend: {
    flexDirection: 'row',
    gap: space[4],
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[1.5],
  },
  swatch: {
    width: 8,
    height: 8,
    borderRadius: 2,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space[1.5],
    paddingHorizontal: space[1],
  },
});
