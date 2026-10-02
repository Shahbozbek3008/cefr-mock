import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X } from 'lucide-react-native';
import { buildReview, isCorrect, useResult } from '@/entities/result';
import { logStudy } from '@/entities/study';
import { useTest, useTestKeys, useTestScripts } from '@/entities/test';
import { buildPractice } from '@/features/mistakes/model/practice';
import { PracticeContext } from '@/features/mistakes/ui/PracticeContext';
import { PracticeQuestion } from '@/features/mistakes/ui/PracticeQuestion';
import { AnswerDetail } from '@/features/review/ui/AnswerDetail';
import { ReviewSkeleton } from '@/features/review/ui/ReviewSkeleton';
import { TranscriptCard } from '@/features/review/ui/TranscriptCard';
import { failureReason } from '@/shared/api';
import { useI18n } from '@/shared/i18n';
import { size, space, useTheme } from '@/shared/theme';
import { Button, IconButton, ProgressBar, Screen, StateView, Text, TopBar } from '@/shared/ui';

const FOOTER_SPACE = size.buttonM + space[3];

export default function MistakesPracticeScreen() {
  const { colors } = useTheme();
  const { t } = useI18n();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const result = useResult(id);
  const testId = result.data?.testId ?? '';
  const test = useTest(testId);
  const keys = useTestKeys(testId);
  const scripts = useTestScripts(testId);
  const [index, setIndex] = useState(0);
  const [values, setValues] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [startedAt, setStartedAt] = useState(() => Date.now());

  const items = test.data && keys.data && result.data ? buildPractice(test.data, keys.data, result.data.answers) : null;
  const item = items?.[index];
  const finished = items !== null && index >= items.length;
  const solved = items?.filter(({ question }) => isCorrect(keys.data?.[question.id], values[question.id] ?? '')).length;

  const value = item ? (values[item.question.id] ?? '') : '';
  const isChecked = item ? Boolean(checked[item.question.id]) : false;
  const review =
    item && isChecked && keys.data
      ? buildReview([item.question], keys.data, values, item.section === 'listening' ? item.part.audioAt : {}).items[0]
      : null;
  const transcript =
    item?.section === 'listening' ? scripts.data?.find((entry) => entry.partId === item.part.id) : undefined;

  useEffect(() => {
    if (finished) logStudy((Date.now() - startedAt) / 1000).catch(() => undefined);
  }, [finished, startedAt]);

  const restart = () => {
    setStartedAt(Date.now());
    setIndex(0);
    setValues({});
    setChecked({});
  };

  const onPrimary = () => {
    if (!item) return;
    if (isChecked) setIndex((current) => current + 1);
    else setChecked((current) => ({ ...current, [item.question.id]: true }));
  };

  const last = items ? index === items.length - 1 : false;
  const failed = [result, test, keys].find((query) => query.isError);

  return (
    <Screen>
      <TopBar
        centered
        left={
          <IconButton accessibilityLabel={t('common.close')} onPress={router.back}>
            <X size={17} color={colors.textStrong} strokeWidth={1.6} />
          </IconButton>
        }
        center={
          <>
            <Text variant="bodySmMedium">{t('mistakes.title')}</Text>
            <Text variant="monoXs" color={colors.textTertiary}>
              {items && !finished ? `${index + 1}/${items.length}` : ' '}
            </Text>
          </>
        }
        right={null}
      />

      <KeyboardAvoidingView behavior="padding" style={styles.flex}>
        <ScrollView
          contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + FOOTER_SPACE + space[6] }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {failed ? (
            <StateView
              tone="error"
              title={t('common.error')}
              message={t(failureReason(failed.error))}
              actionLabel={t('common.retry')}
              onAction={() => failed.refetch()}
            />
          ) : !items ? (
            <ReviewSkeleton />
          ) : items.length === 0 ? (
            <StateView title={t('mistakes.noneTitle')} message={t('mistakes.noneMessage')} />
          ) : finished ? (
            <StateView
              title={t('mistakes.doneTitle', { solved: solved ?? 0, total: items.length })}
              message={t('mistakes.doneMessage')}
              actionLabel={t('mistakes.again')}
              onAction={restart}
            />
          ) : item ? (
            <>
              <ProgressBar value={index / items.length} />
              <PracticeContext key={item.question.id} item={item} />
              {review ? (
                <>
                  <AnswerDetail item={review} question={item.question} choices={item.part.choices} />
                  {transcript ? <TranscriptCard transcript={transcript} questionNumber={item.question.number} /> : null}
                </>
              ) : (
                <PracticeQuestion
                  item={item}
                  value={value}
                  onChange={(next) => setValues((current) => ({ ...current, [item.question.id]: next }))}
                />
              )}
            </>
          ) : null}
        </ScrollView>

        {item ? (
          <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, space[3]) }]}>
            <Button
              label={t(isChecked ? (last ? 'common.finish' : 'common.next') : 'mistakes.check')}
              size="M"
              align="center"
              disabled={!isChecked && value.trim() === ''}
              onPress={onPrimary}
            />
          </View>
        ) : finished ? (
          <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, space[3]) }]}>
            <Button label={t('common.close')} size="M" align="center" onPress={router.back} />
          </View>
        ) : null}
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  content: {
    paddingTop: space[3.5],
    gap: space[3.5],
  },
  footer: {
    paddingTop: space[3],
  },
});
