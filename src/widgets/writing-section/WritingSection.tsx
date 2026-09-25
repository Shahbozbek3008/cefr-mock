import { memo, useCallback, useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowRight } from 'lucide-react-native';
import { useAttemptStore } from '@/entities/attempt';
import type { TestDetail, WritingTask } from '@/entities/test';
import { useSessionControls } from '@/features/test-session/model/useSessionControls';
import { SectionTimer } from '@/features/test-session/ui/SectionTimer';
import { SessionFooter } from '@/features/test-session/ui/SessionFooter';
import { SessionHeader } from '@/features/test-session/ui/SessionHeader';
import { SessionSheets } from '@/features/test-session/ui/SessionSheets';
import { light, size, space } from '@/shared/theme';
import { Button, ConfirmSheet, SegmentedControl } from '@/shared/ui';
import { countWords, useDrafts } from './draft';
import { Editor } from './Editor';
import { SavedNote } from './SavedNote';
import { TaskBrief, TaskCard } from './TaskCard';

type Pane = 'task' | 'answer';

const paneOptions = [
  { value: 'task', label: 'Topshiriq' },
  { value: 'answer', label: 'Javob' },
] as const;

const AnswerPane = memo<{ task: WritingTask; text: string; onChange: (taskId: string, text: string) => void }>(
  ({ task, text, onChange }) => (
    <>
      <TaskCard task={task} />
      <Editor value={text} onChange={(value) => onChange(task.id, value)} targetWords={task.targetWords} />
      <SavedNote />
    </>
  ),
);

AnswerPane.displayName = 'AnswerPane';

export const WritingSection = memo<{ test: TestDetail }>(({ test }) => {
  const insets = useSafeAreaInsets();
  const tasks = test.writing;
  const controls = useSessionControls(test, 'writing');
  const setPosition = useAttemptStore((s) => s.setPosition);
  const [index, setIndex] = useState(() => useAttemptStore.getState().position.writing ?? 0);
  const [pane, setPane] = useState<Pane>('answer');
  const [shortWarning, setShortWarning] = useState<string | null>(null);
  const { drafts, update, flush } = useDrafts();

  const task = tasks[index];
  const other = tasks[(index + 1) % tasks.length];
  const footerSpace = Math.max(insets.bottom, space[3]) + size.buttonM + space[3];

  useEffect(() => {
    setPosition('writing', index);
  }, [index, setPosition]);

  const { requestFinish, finish } = controls;

  const submit = useCallback(() => {
    const writing = flush();
    const short = tasks.filter((t) => countWords(writing[t.id] ?? '') < t.minWords);
    if (short.length === 0) {
      requestFinish();
      return;
    }
    setShortWarning(short.map((t) => `${t.label}: ${countWords(writing[t.id] ?? '')}/${t.minWords} so'z`).join(', '));
  }, [flush, requestFinish, tasks]);

  const confirmShort = useCallback(() => {
    setShortWarning(null);
    finish();
  }, [finish]);

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.screen}>
      <View style={[styles.body, { paddingTop: insets.top + size.topGap, paddingBottom: footerSpace + space[3] }]}>
        <SessionHeader
          title="Writing"
          subtitle={`${task.label} · ${task.kind}`}
          timer={<SectionTimer section="writing" onExpire={finish} />}
          onClose={controls.requestExit}
        />
        <SegmentedControl options={paneOptions} value={pane} onChange={setPane} />
        {pane === 'answer' ? (
          <AnswerPane task={task} text={drafts[task.id] ?? ''} onChange={update} />
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}>
            <TaskBrief task={task} />
          </ScrollView>
        )}
      </View>

      <SessionFooter>
        <View style={styles.actions}>
          {tasks.length > 1 ? (
            <View style={styles.secondary}>
              <Button label={other.label} variant="secondary" size="M" onPress={() => setIndex(tasks.indexOf(other))} />
            </View>
          ) : null}
          <View style={styles.primary}>
            <Button
              label="Topshirish"
              size="M"
              onPress={submit}
              trailingIcon={<ArrowRight size={18} color={light.onAction} strokeWidth={1.75} />}
            />
          </View>
        </View>
      </SessionFooter>

      <ConfirmSheet
        visible={shortWarning !== null}
        title="So'zlar soni yetarli emas"
        message={`${shortWarning ?? ''}. Kam so'zli javob pastroq baholanadi.`}
        confirmLabel="Baribir topshirish"
        cancelLabel="Yozishni davom ettirish"
        onConfirm={confirmShort}
        onClose={() => setShortWarning(null)}
      />
      <SessionSheets controls={controls} />
    </KeyboardAvoidingView>
  );
});

WritingSection.displayName = 'WritingSection';

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: light.bg,
  },
  body: {
    flex: 1,
    paddingHorizontal: size.screenPadding,
    gap: space[3.5],
  },
  actions: {
    flexDirection: 'row',
    gap: space[2.5],
  },
  secondary: {
    flex: 1,
  },
  primary: {
    flex: 1.3,
  },
});
