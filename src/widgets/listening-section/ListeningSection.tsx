import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowRight } from 'lucide-react-native';
import { FlagButton, QuestionNavigator, useAttemptStore } from '@/entities/attempt';
import type { TestDetail } from '@/entities/test';
import { useSessionControls } from '@/features/test-session/model/useSessionControls';
import { InstructionBlock } from '@/features/test-session/ui/InstructionBlock';
import { SectionTimer } from '@/features/test-session/ui/SectionTimer';
import { SessionFooter } from '@/features/test-session/ui/SessionFooter';
import { SessionHeader } from '@/features/test-session/ui/SessionHeader';
import { SessionSheets } from '@/features/test-session/ui/SessionSheets';
import { light, size, space } from '@/shared/theme';
import { Button } from '@/shared/ui';
import { AudioCard } from './AudioCard';
import { McqCard } from './McqCard';
import { NotesCard } from './NotesCard';

const NAVIGATOR_HEIGHT = 34;
const FOOTER_SPACE = NAVIGATOR_HEIGHT + size.buttonM + space[3] * 2;

export const ListeningSection = memo<{ test: TestDetail }>(({ test }) => {
  const insets = useSafeAreaInsets();
  const parts = test.listening;
  const questions = useMemo(() => parts.flatMap((p) => p.questions), [parts]);
  const controls = useSessionControls(test, 'listening', questions);
  const setPosition = useAttemptStore((s) => s.setPosition);

  const [currentId, setCurrentId] = useState(
    () => questions[useAttemptStore.getState().position.listening ?? 0]?.id ?? questions[0].id,
  );
  const scrollRef = useRef<ScrollView>(null);
  const inputs = useRef<Record<string, TextInput | null>>({});
  const offsets = useRef<Record<string, number>>({});
  const pendingFocus = useRef<string | null>(null);

  const currentIndex = questions.findIndex((q) => q.id === currentId);
  const partIndex = parts.findIndex((p) => p.questions.some((q) => q.id === currentId));
  const part = parts[partIndex];
  const indexInPart = part.questions.findIndex((q) => q.id === currentId);
  const next = questions[currentIndex + 1];
  const nextInOtherPart = next && !part.questions.includes(next);

  useEffect(() => {
    setPosition('listening', currentIndex);
  }, [currentIndex, setPosition]);

  useEffect(() => {
    if (pendingFocus.current !== currentId) return;
    pendingFocus.current = null;
    const input = inputs.current[currentId];
    if (input) {
      input.focus();
      return;
    }
    const y = offsets.current[currentId];
    if (y !== undefined) scrollRef.current?.scrollTo({ y: y - space[4], animated: true });
  }, [currentId]);

  const select = useCallback((id: string) => {
    pendingFocus.current = id;
    setCurrentId(id);
  }, []);

  const registerInput = useCallback((id: string, input: TextInput | null) => {
    inputs.current[id] = input;
  }, []);

  const registerOffset = useCallback((id: string, y: number) => {
    offsets.current[id] = y;
  }, []);

  const { requestFinish } = controls;

  const goNext = useCallback(() => {
    if (next) select(next.id);
    else requestFinish();
  }, [next, requestFinish, select]);

  const onAudioEnded = useCallback(() => {
    const following = parts[partIndex + 1];
    if (following) select(following.questions[0].id);
    else requestFinish();
  }, [partIndex, parts, requestFinish, select]);

  const onReview = useCallback(
    (number: number) => {
      const target = questions.find((q) => q.number === number);
      if (target) select(target.id);
    },
    [questions, select],
  );

  const first = part.questions[0].number;
  const last = part.questions[part.questions.length - 1].number;

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.screen}>
      <View style={[styles.header, { paddingTop: insets.top + size.topGap }]}>
        <SessionHeader
          title="Listening"
          counter={`${partIndex + 1}/${parts.length}`}
          progress={{ total: parts.length, completed: partIndex, current: indexInPart / part.questions.length }}
          timer={<SectionTimer section="listening" onExpire={controls.finish} />}
          onClose={controls.requestExit}
        />
      </View>

      <ScrollView
        ref={scrollRef}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: Math.max(insets.bottom, space[3]) + FOOTER_SPACE + space[4] },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <AudioCard key={part.id} durationSec={part.durationSec} onEnded={onAudioEnded} />
        <InstructionBlock range={`${first}–${last}`} instruction={part.instruction} emphasis={part.emphasis} />
        {part.title ? (
          <NotesCard
            title={part.title}
            questions={part.questions}
            onFocus={setCurrentId}
            registerInput={registerInput}
          />
        ) : (
          part.questions.map((q) =>
            q.kind === 'mcq' ? (
              <McqCard
                key={q.id}
                question={q}
                current={q.id === currentId}
                onAnswer={setCurrentId}
                onLayout={registerOffset}
              />
            ) : null,
          )
        )}
      </ScrollView>

      <SessionFooter>
        <QuestionNavigator questions={part.questions} currentId={currentId} onSelect={select} />
        <View style={styles.actions}>
          <FlagButton questionId={currentId} />
          <Button
            label={next ? (nextInOtherPart ? 'Keyingi qism' : 'Keyingi savol') : 'Yakunlash'}
            size="M"
            grow
            onPress={goNext}
            trailingIcon={<ArrowRight size={18} color={light.onAction} strokeWidth={1.75} />}
          />
        </View>
      </SessionFooter>

      <SessionSheets controls={controls} onReview={onReview} />
    </KeyboardAvoidingView>
  );
});

ListeningSection.displayName = 'ListeningSection';

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: light.bg,
  },
  header: {
    paddingHorizontal: size.screenPadding,
  },
  content: {
    paddingTop: space[3.5],
    paddingHorizontal: size.screenPadding,
    gap: space[3.5],
  },
  actions: {
    flexDirection: 'row',
    gap: space[2.5],
  },
});
