import { memo, useCallback, useEffect, useState } from 'react';
import { Linking, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAttemptStore } from '@/entities/attempt';
import type { SpeakingQuestion, TestDetail } from '@/entities/test';
import { useSessionControls } from '@/features/test-session/model/useSessionControls';
import { SessionHeader } from '@/features/test-session/ui/SessionHeader';
import { SessionSheets } from '@/features/test-session/ui/SessionSheets';
import { light, size, space } from '@/shared/theme';
import { SegmentProgress, StateView, StaticTimerPill } from '@/shared/ui';
import { PromptCard } from './PromptCard';
import { RecordControls } from './RecordControls';
import { RecorderCard } from './RecorderCard';
import { useAnswerRecorder } from './useAnswerRecorder';

const CONTROLS_SPACE = 80 + space[10];

type QuestionViewProps = {
  question: SpeakingQuestion;
  index: number;
  total: number;
  onClose: () => void;
  onNext: () => void;
};

const QuestionView = memo<QuestionViewProps>(({ question, index, total, onClose, onNext }) => {
  const insets = useSafeAreaInsets();
  const setRecording = useAttemptStore((s) => s.setRecording);
  const onSaved = useCallback((uri: string) => setRecording(question.id, uri), [question.id, setRecording]);
  const { phase, secondsLeft, elapsed, bars, start, stop, restart } = useAnswerRecorder(question, onSaved);

  const next = useCallback(async () => {
    if (phase === 'recording') await stop();
    onNext();
  }, [onNext, phase, stop]);

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + size.topGap, paddingBottom: insets.bottom + CONTROLS_SPACE + space[4] },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <SessionHeader
          title="Speaking"
          subtitle={`Part ${question.part} · Savol ${index + 1} / ${total}`}
          timer={<StaticTimerPill seconds={secondsLeft} tone={phase === 'recording' ? 'warning' : 'normal'} />}
          onClose={onClose}
        />
        <SegmentProgress total={total} completed={index} />
        <PromptCard question={question} />
        {phase === 'denied' ? (
          <StateView
            tone="error"
            title="Mikrofonga ruxsat berilmagan"
            message="Speaking javobini yozib olish uchun sozlamalarda mikrofonni yoqing."
            actionLabel="Sozlamalarni ochish"
            onAction={() => Linking.openSettings()}
          />
        ) : (
          <RecorderCard question={question} phase={phase} elapsed={elapsed} bars={bars} />
        )}
      </ScrollView>

      <View style={[styles.controls, { bottom: insets.bottom + space[2.5] }]}>
        <RecordControls phase={phase} onRestart={restart} onRecord={start} onStop={stop} onNext={next} />
      </View>
    </View>
  );
});

QuestionView.displayName = 'SpeakingQuestionView';

export const SpeakingSection = memo<{ test: TestDetail }>(({ test }) => {
  const questions = test.speaking;
  const controls = useSessionControls(test, 'speaking');
  const setPosition = useAttemptStore((s) => s.setPosition);
  const [index, setIndex] = useState(() => useAttemptStore.getState().position.speaking ?? 0);

  useEffect(() => {
    setPosition('speaking', index);
  }, [index, setPosition]);

  const { requestFinish } = controls;

  const onNext = useCallback(() => {
    if (index === questions.length - 1) requestFinish();
    else setIndex(index + 1);
  }, [index, questions.length, requestFinish]);

  const question = questions[index];

  return (
    <>
      <QuestionView
        key={question.id}
        question={question}
        index={index}
        total={questions.length}
        onClose={controls.requestExit}
        onNext={onNext}
      />
      <SessionSheets controls={controls} />
    </>
  );
});

SpeakingSection.displayName = 'SpeakingSection';

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: light.bg,
  },
  content: {
    paddingHorizontal: size.screenPadding,
    gap: space[4.5],
  },
  controls: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
});
