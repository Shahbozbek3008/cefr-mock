import { memo } from 'react';
import { ScrollView, View } from 'react-native';
import { GapInput, McqOptions, TfngChoices, useAnswer } from '@/entities/attempt';
import type { Question } from '@/entities/test';
import { useI18n } from '@/shared/i18n';
import { makeStyles, radius, size, space, useTheme } from '@/shared/theme';
import { Tag, Text } from '@/shared/ui';

const Dot = memo<{ id: string; current: boolean }>(({ id, current }) => {
  const styles = useStyles();
  const answered = useAnswer(id).trim() !== '';
  return <View style={[styles.dot, current && styles.dotCurrent, (answered || current) && styles.dotFilled]} />;
});

Dot.displayName = 'QuestionDot';

export type QuestionPanelProps = {
  question: Question;
  siblings: Question[];
  expanded: boolean;
  bottomInset: number;
};

const PanelBody = memo<{ question: Question; siblings: Question[] }>(({ question, siblings }) => {
  const styles = useStyles();
  const { colors } = useTheme();
  const { t } = useI18n();

  return (
    <>
      <View style={styles.header}>
        <View style={styles.kind}>
          <Tag label={`Q${question.number}`} tone="lime" size="md" mono />
          <Text variant="callout" color={colors.textSecondary}>
            {t(`reading.kinds.${question.kind}`)}
          </Text>
        </View>
        <View style={styles.dots}>
          {siblings.map((q) => (
            <Dot key={q.id} id={q.id} current={q.id === question.id} />
          ))}
        </View>
      </View>

      <Text variant="body">{question.prompt}</Text>

      {question.kind === 'tfng' ? <TfngChoices questionId={question.id} /> : null}
      {question.kind === 'mcq' ? <McqOptions question={question} /> : null}
      {question.kind === 'gap' ? <GapInput questionId={question.id} number={question.number} variant="field" /> : null}
    </>
  );
});

PanelBody.displayName = 'PanelBody';

export const QuestionPanel = memo<QuestionPanelProps>(({ question, siblings, expanded, bottomInset }) => {
  const styles = useStyles();
  const { elevation } = useTheme();
  const contentStyle = [styles.content, { paddingBottom: bottomInset + space[4] }];

  return (
    <View style={[styles.panel, elevation.sheetUp, expanded && styles.expanded]}>
      <View style={styles.grabber} />
      {expanded ? (
        <ScrollView
          contentContainerStyle={contentStyle}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <PanelBody question={question} siblings={siblings} />
        </ScrollView>
      ) : (
        <View style={contentStyle}>
          <PanelBody question={question} siblings={siblings} />
        </View>
      )}
    </View>
  );
});

QuestionPanel.displayName = 'QuestionPanel';

const useStyles = makeStyles(({ colors }) => ({
  panel: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.sheet,
    borderTopRightRadius: radius.sheet,
    paddingTop: space[2.5],
  },
  expanded: {
    flex: 1,
  },
  grabber: {
    alignSelf: 'center',
    width: 36,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.border,
  },
  content: {
    paddingTop: space[3],
    paddingHorizontal: size.screenPadding,
    gap: space[3],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  kind: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2.5],
  },
  dots: {
    flexDirection: 'row',
    gap: space[1],
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.border,
  },
  dotCurrent: {
    width: 14,
  },
  dotFilled: {
    backgroundColor: colors.data,
  },
}));
