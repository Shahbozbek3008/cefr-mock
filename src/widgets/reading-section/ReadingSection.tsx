import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, ChevronRight, LayoutGrid } from 'lucide-react-native';
import { QuestionGridSheet, useAttemptStore } from '@/entities/attempt';
import type { TestDetail } from '@/entities/test';
import { useSessionControls } from '@/features/test-session/model/useSessionControls';
import { SectionTimer } from '@/features/test-session/ui/SectionTimer';
import { SessionFooter } from '@/features/test-session/ui/SessionFooter';
import { SessionHeader } from '@/features/test-session/ui/SessionHeader';
import { SessionSheets } from '@/features/test-session/ui/SessionSheets';
import { useKeyboardLift } from '@/shared/lib';
import { makeStyles, radius, size, space, useTheme } from '@/shared/theme';
import { Button, IconButton, SegmentedControl, Text } from '@/shared/ui';
import { Passage } from './Passage';
import { QuestionPanel } from './QuestionPanel';

type ViewMode = 'text' | 'both' | 'questions';

const modeOptions = [
  { value: 'text', label: 'Matn' },
  { value: 'both', label: 'Ikkalasi' },
  { value: 'questions', label: 'Savollar' },
] as const;

export const ReadingSection = memo<{ test: TestDetail }>(({ test }) => {
  const styles = useStyles();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const parts = test.reading;
  const questions = useMemo(() => parts.flatMap((p) => p.questions), [parts]);
  const controls = useSessionControls(test, 'reading', questions);
  const setPosition = useAttemptStore((s) => s.setPosition);

  const [index, setIndex] = useState(() => useAttemptStore.getState().position.reading ?? 0);
  const [mode, setMode] = useState<ViewMode>('both');
  const [serif, setSerif] = useState(false);
  const [gridOpen, setGridOpen] = useState(false);

  const question = questions[index];
  const partIndex = parts.findIndex((p) => p.questions.includes(question));
  const part = parts[partIndex];
  const indexInPart = part.questions.indexOf(question);
  const footerSpace = Math.max(insets.bottom, space[3]) + size.buttonM + space[3];
  const lift = useKeyboardLift(footerSpace);

  useEffect(() => {
    setPosition('reading', index);
  }, [index, setPosition]);

  const { requestFinish } = controls;

  const goPrev = useCallback(() => setIndex((i) => Math.max(0, i - 1)), []);

  const goNext = useCallback(() => {
    if (index === questions.length - 1) requestFinish();
    else setIndex(index + 1);
  }, [index, questions.length, requestFinish]);

  const selectById = useCallback(
    (id: string) => {
      setGridOpen(false);
      setIndex(questions.findIndex((q) => q.id === id));
    },
    [questions],
  );

  const onReview = useCallback(
    (number: number) => setIndex(questions.findIndex((q) => q.number === number)),
    [questions],
  );

  const finishFromGrid = useCallback(() => {
    setGridOpen(false);
    requestFinish();
  }, [requestFinish]);

  return (
    <View style={styles.screen}>
      <Animated.View style={[styles.body, lift]}>
        <View style={[styles.top, { paddingTop: insets.top + size.topGap }]}>
          <SessionHeader
            title="Reading"
            counter={`${partIndex + 1}/${parts.length}`}
            progress={{ total: parts.length, completed: partIndex, current: indexInPart / part.questions.length }}
            timer={<SectionTimer section="reading" onExpire={controls.finish} />}
            onClose={controls.requestExit}
          />
          <View style={styles.tools}>
            <SegmentedControl options={modeOptions} value={mode} onChange={setMode} style={styles.modes} />
            <Pressable
              accessibilityRole="switch"
              accessibilityLabel="Serif shrift"
              accessibilityState={{ checked: serif }}
              onPress={() => setSerif((value) => !value)}
              style={[styles.fontToggle, serif && styles.fontToggleActive]}
            >
              <Text variant="serifLabel" color={serif ? colors.selectedText : colors.text} style={styles.fontLabel}>
                Aa
              </Text>
            </Pressable>
          </View>
        </View>

        {mode === 'questions' ? null : (
          <Passage part={part} serif={serif} bottomInset={mode === 'text' ? footerSpace : 0} />
        )}

        {mode === 'text' ? null : (
          <QuestionPanel
            question={question}
            siblings={part.questions}
            expanded={mode === 'questions'}
            bottomInset={footerSpace}
          />
        )}
      </Animated.View>

      <SessionFooter tone="solid">
        <View style={styles.actions}>
          <IconButton
            accessibilityLabel="Oldingi savol"
            shape="square"
            tone="outline"
            disabled={index === 0}
            onPress={goPrev}
          >
            <ChevronLeft size={18} color={index === 0 ? colors.disabledText : colors.textStrong} strokeWidth={1.6} />
          </IconButton>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Savollar ro'yxati"
            onPress={() => setGridOpen(true)}
            style={styles.overview}
          >
            <View style={styles.overviewLabel}>
              <LayoutGrid size={17} color={colors.textStrong} strokeWidth={1.5} />
              <Text variant="bodySm" color={colors.textStrong}>
                Savollar
              </Text>
            </View>
            <Text variant="monoCallout" color={colors.textSecondary}>
              {question.number}
              <Text variant="monoCallout" color={colors.textTertiary}>
                {`/${questions.length}`}
              </Text>
            </Text>
          </Pressable>
          <Button
            accessibilityLabel={index === questions.length - 1 ? 'Yakunlash' : 'Keyingi savol'}
            size="M"
            icon={<ChevronRight size={18} color={colors.onAction} strokeWidth={1.75} />}
            onPress={goNext}
          />
        </View>
      </SessionFooter>

      <QuestionGridSheet
        visible={gridOpen}
        questions={questions}
        currentId={question.id}
        onSelect={selectById}
        onFinish={finishFromGrid}
        onClose={() => setGridOpen(false)}
      />
      <SessionSheets controls={controls} onReview={onReview} />
    </View>
  );
});

ReadingSection.displayName = 'ReadingSection';

const useStyles = makeStyles(({ colors }) => ({
  body: {
    flex: 1,
  },
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  top: {
    paddingHorizontal: size.screenPadding,
    gap: space[3],
  },
  tools: {
    flexDirection: 'row',
    gap: space[2],
  },
  modes: {
    flex: 1,
  },
  fontToggle: {
    width: 44,
    height: 36,
    borderRadius: radius.input,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.hairline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fontToggleActive: {
    backgroundColor: colors.chipActiveBg,
    borderColor: colors.chipActiveBg,
  },
  fontLabel: {
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    gap: space[2.5],
  },
  overview: {
    flex: 1,
    height: size.buttonM,
    borderRadius: radius.button,
    backgroundColor: colors.bg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: space[4],
  },
  overviewLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2],
  },
}));
