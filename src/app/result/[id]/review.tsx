import { useCallback, useMemo, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { buildReview, useResult } from '@/entities/result';
import { sectionTitles, useTest } from '@/entities/test';
import type { ListeningPart } from '@/entities/test';
import { AnswerDetail } from '@/features/review/ui/AnswerDetail';
import { ReviewGrid } from '@/features/review/ui/ReviewGrid';
import { ReviewSkeleton } from '@/features/review/ui/ReviewSkeleton';
import { useI18n } from '@/shared/i18n';
import { makeStyles, radius, size, space, useTheme } from '@/shared/theme';
import { Button, IconButton, Screen, SegmentedControl, Text, TopBar } from '@/shared/ui';

type Tab = 'listening' | 'reading' | 'writing' | 'speaking';

const tabOptions = [
  { value: 'listening', label: 'Listening' },
  { value: 'reading', label: 'Reading' },
  { value: 'writing', label: 'Writing' },
  { value: 'speaking', label: 'Speaking' },
] as const;

const FOOTER_SPACE = size.buttonM + space[3];

const audioMarks = (parts: ListeningPart[]): Record<number, number> =>
  Object.assign({}, ...parts.map((part) => part.audioAt));

export default function ReviewScreen() {
  const styles = useStyles();
  const { colors } = useTheme();

  const { t } = useI18n();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const result = useResult(id);
  const test = useTest(result.data?.testId ?? '');
  const [tab, setTab] = useState<'listening' | 'reading'>('listening');
  const [onlyWrong, setOnlyWrong] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const parts = test.data?.[tab];
  const questions = useMemo(() => parts?.flatMap((p) => p.questions) ?? [], [parts]);
  const review = useMemo(() => {
    if (!test.data || !result.data) return null;
    const marks = tab === 'listening' ? audioMarks(test.data.listening) : {};
    return buildReview(questions, result.data.answers, marks);
  }, [questions, result.data, tab, test.data]);

  const wrong = useMemo(() => review?.items.filter((i) => i.status !== 'correct') ?? [], [review]);
  const navigable = onlyWrong ? wrong : (review?.items ?? []);
  const current = review?.items.find((i) => i.questionId === selectedId) ?? navigable[0] ?? review?.items[0];
  const position = current ? navigable.indexOf(current) : -1;
  const question = questions.find((q) => q.id === current?.questionId);

  const onTab = useCallback(
    (value: Tab) => {
      if (value === 'listening' || value === 'reading') {
        setTab(value);
        setSelectedId(null);
        return;
      }
      router.push({ pathname: value === 'writing' ? '/result/[id]/writing' : '/result/[id]/speaking', params: { id } });
    },
    [id],
  );

  const step = useCallback(
    (delta: number) => {
      const target = navigable[Math.max(0, Math.min(navigable.length - 1, position + delta))];
      if (target) setSelectedId(target.questionId);
    },
    [navigable, position],
  );

  const modeLabel = t(onlyWrong ? 'review.onlyWrong' : 'review.allQuestions');
  const counter = `${position >= 0 ? position + 1 : '–'}/${navigable.length}`;

  return (
    <Screen>
      <TopBar
        centered
        left={
          <IconButton accessibilityLabel={t('common.back')} onPress={router.back}>
            <ChevronLeft size={17} color={colors.textStrong} strokeWidth={1.6} />
          </IconButton>
        }
        center={
          <>
            <Text variant="bodySmMedium">Batafsil tahlil</Text>
            <Text variant="caption" color={colors.textSecondary}>
              {test.data ? t('review.subtitle', { number: test.data.number, section: sectionTitles[tab] }) : ' '}
            </Text>
          </>
        }
        right={null}
      />

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + FOOTER_SPACE + space[6] }]}
        showsVerticalScrollIndicator={false}
      >
        <SegmentedControl options={tabOptions} value={tab} onChange={onTab} size="compact" />

        {review && current && question ? (
          <>
            <View style={styles.summary}>
              <Summary value={review.correct} label={t('review.correct')} color={colors.success.text} />
              <Summary value={review.wrong} label={t('review.wrong')} color={colors.error.text} />
              <Summary value={review.empty} label={t('review.empty')} color={colors.text} />
            </View>
            <ReviewGrid items={review.items} selectedId={current.questionId} onSelect={setSelectedId} />
            <AnswerDetail item={current} question={question} />
          </>
        ) : (
          <ReviewSkeleton />
        )}
      </ScrollView>

      <View style={[styles.footer, { bottom: insets.bottom + space[3] }]}>
        <IconButton
          accessibilityLabel={t('common.previous')}
          shape="square"
          tone="outline"
          disabled={position <= 0}
          onPress={() => step(-1)}
        >
          <ChevronLeft size={18} color={position <= 0 ? colors.disabledText : colors.textStrong} strokeWidth={1.6} />
        </IconButton>
        <Pressable
          accessibilityRole="switch"
          accessibilityState={{ checked: onlyWrong }}
          accessibilityLabel={t('review.onlyWrongA11y')}
          onPress={() => setOnlyWrong((value) => !value)}
          style={styles.mode}
        >
          <Text variant="bodySm" color={colors.textStrong}>
            {`${modeLabel} · `}
          </Text>
          <Text variant="mono" color={colors.textStrong}>
            {counter}
          </Text>
        </Pressable>
        <Button
          accessibilityLabel={t('common.next')}
          size="M"
          icon={<ChevronRight size={18} color={colors.onAction} strokeWidth={1.75} />}
          disabled={position >= navigable.length - 1}
          onPress={() => step(1)}
        />
      </View>
    </Screen>
  );
}

const Summary = ({ value, label, color }: { value: number; label: string; color: string }) => {
  const { colors } = useTheme();

  return (
    <Text variant="callout" color={colors.textSecondary}>
      <Text variant="monoCalloutMedium" color={color}>
        {value}
      </Text>
      {` ${label}`}
    </Text>
  );
};

const useStyles = makeStyles(({ colors }) => ({
  content: {
    paddingTop: space[3.5],
    gap: space[3.5],
  },
  summary: {
    flexDirection: 'row',
    gap: space[4],
    paddingHorizontal: space[1],
  },
  footer: {
    position: 'absolute',
    left: size.screenPadding,
    right: size.screenPadding,
    flexDirection: 'row',
    gap: space[2.5],
  },
  mode: {
    flex: 1,
    height: size.buttonM,
    borderRadius: radius.button,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));
