'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Check } from 'lucide-react';
import type { TestDetail, WritingTask } from '@cefr/core';
import { cn } from '@/lib/cn';
import { useAttemptStore } from '@/lib/attempt-store';
import { useSessionControls } from '@/lib/exam/session';
import { Icon } from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ExamHeader, SectionTimer } from './exam-header';
import { SessionDialogs } from './session-dialogs';

const AUTOSAVE_MS = 2000;
const STATUS_TICK_MS = 5000;

export const countWords = (text: string) => {
  const trimmed = text.trim();
  return trimmed === '' ? 0 : trimmed.split(/\s+/).length;
};

const useDrafts = () => {
  const setWriting = useAttemptStore((s) => s.setWriting);
  const [drafts, setDrafts] = useState(() => useAttemptStore.getState().writing);
  const latest = useRef(drafts);

  useEffect(() => {
    latest.current = drafts;
  }, [drafts]);

  const update = useCallback((taskId: string, text: string) => setDrafts((current) => ({ ...current, [taskId]: text })), []);

  const flush = useCallback(() => {
    const saved = useAttemptStore.getState().writing;
    Object.entries(latest.current).forEach(([taskId, text]) => {
      if (saved[taskId] !== text) setWriting(taskId, text);
    });
    return latest.current;
  }, [setWriting]);

  useEffect(() => {
    const timer = setTimeout(flush, AUTOSAVE_MS);
    return () => clearTimeout(timer);
  }, [drafts, flush]);

  useEffect(() => () => void flush(), [flush]);

  return { drafts, update, flush };
};

function SavedNote() {
  const t = useTranslations('exam.writing');
  const savedAt = useAttemptStore((s) => s.writingSavedAt);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), STATUS_TICK_MS);
    return () => clearInterval(id);
  }, []);

  const seconds = savedAt ? Math.max(1, Math.round((now - savedAt) / 1000)) : 0;
  const label = !savedAt ? t('savedAuto') : seconds < 60 ? t('savedSeconds', { count: seconds }) : t('savedMinutes', { count: Math.round(seconds / 60) });

  return (
    <span className="flex items-center gap-1.5 text-xs text-ink-2" aria-live="polite">
      {savedAt && <Icon as={Check} size={13} strokeWidth={2.2} className="text-success" />}
      {label}
    </span>
  );
}

function TaskBrief({ task }: { task: WritingTask }) {
  const t = useTranslations('exam');
  return (
    <div className="flex flex-col gap-4 rounded-card-sm bg-surface p-6 shadow-[0_0_0_1px_rgba(20,22,30,.06),0_1px_2px_rgba(20,22,30,.04)]">
      <span className="font-mono text-xs text-ink-3 uppercase">{`${task.label} · ${task.kind}`}</span>
      {task.context && <p className="m-0 rounded-[12px] bg-surface-muted px-4 py-3 text-sm leading-relaxed whitespace-pre-line text-ink-body">{task.context}</p>}
      <p className="m-0 text-[17px] leading-[1.6] tracking-[-0.01em] whitespace-pre-line">{task.prompt}</p>
      <dl className="m-0 flex flex-col gap-2.5 pt-4 text-sm text-ink-body shadow-[0_-1px_0_var(--divider)]">
        <div className="flex justify-between">
          <dt>{t('writing.minVolume')}</dt>
          <dd className="m-0 font-mono">{t('units.words', { count: task.minWords })}</dd>
        </div>
        <div className="flex justify-between">
          <dt>{t('writing.recommended')}</dt>
          <dd className="m-0 font-mono">{t('units.words', { count: task.targetWords })}</dd>
        </div>
      </dl>
    </div>
  );
}

function Editor({ task, value, onChange }: { task: WritingTask; value: string; onChange: (text: string) => void }) {
  const t = useTranslations('exam.writing');
  const words = countWords(value);
  const enough = words >= task.minWords;
  const ratio = Math.min(1, words / task.targetWords);

  return (
    <div className="flex min-h-[420px] flex-col rounded-card-sm bg-surface shadow-inset transition-shadow duration-(--t-sheet) focus-within:shadow-[inset_0_0_0_1.5px_var(--green-500),0_0_0_6px_oklch(0.6_0.16_138/.12)]">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t('placeholder')}
        aria-label={t('answerA11y')}
        spellCheck={false}
        className="min-h-0 flex-1 resize-none bg-transparent px-7 py-6 text-[17px] leading-[1.85] text-ink caret-green outline-none placeholder:text-ink-disabled"
      />
      <div className="flex flex-wrap items-center gap-4 px-6 py-3.5 shadow-[0_-1px_0_var(--divider)]">
        <div className="relative h-1.5 w-[220px] overflow-hidden rounded-[3px] bg-track">
          <span className={cn('absolute inset-y-0 left-0 rounded-[3px] transition-[width] duration-(--t-sheet)', enough ? 'bg-green' : 'bg-blue')} style={{ width: `${ratio * 100}%` }} />
          <span className="absolute inset-y-0 w-px bg-ink-3" style={{ left: `${(task.minWords / task.targetWords) * 100}%` }} />
        </div>
        <span className="font-mono text-[13px] text-ink-2">
          <span className={cn('font-medium', enough ? 'text-green-text' : 'text-ink')}>{words}</span> / {task.targetWords}
        </span>
        <span className="ml-auto"><SavedNote /></span>
      </div>
    </div>
  );
}

export function WritingSection({ test }: { test: TestDetail }) {
  const t = useTranslations('exam');
  const tasks = test.writing;
  const controls = useSessionControls(test, 'writing');
  const setPosition = useAttemptStore((s) => s.setPosition);
  const [index, setIndex] = useState(() => useAttemptStore.getState().position.writing ?? 0);
  const [shortWarning, setShortWarning] = useState<string | null>(null);
  const { drafts, update, flush } = useDrafts();
  const task = tasks[index];

  useEffect(() => {
    setPosition('writing', index);
  }, [index, setPosition]);

  const { requestFinish, finish } = controls;

  const submit = () => {
    const writing = flush();
    const short = tasks.filter((item) => countWords(writing[item.id] ?? '') < item.minWords);
    if (short.length === 0) {
      requestFinish();
      return;
    }
    setShortWarning(short.map((item) => t('writing.shortItem', { task: item.label, count: countWords(writing[item.id] ?? ''), min: item.minWords })).join(', '));
  };

  const expire = () => {
    flush();
    finish();
  };

  return (
    <>
      <ExamHeader
        title="Writing"
        subtitle={`${task.label} · ${task.kind}`}
        section="writing"
        timer={<SectionTimer section="writing" onExpire={expire} />}
        onExit={controls.requestExit}
        onFinish={submit}
      />
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="grid gap-5 px-6 py-6 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
          <div className="flex flex-col gap-4">
            {tasks.length > 1 && (
              <div role="tablist" className="flex h-11 rounded-[14px] bg-seg-track p-1 text-sm">
                {tasks.map((item, i) => (
                  <button
                    key={item.id}
                    type="button"
                    role="tab"
                    aria-selected={i === index}
                    onClick={() => setIndex(i)}
                    className={cn('flex flex-1 items-center justify-center gap-2 rounded-[10px] transition-colors', i === index ? 'bg-surface font-medium text-ink shadow-[0_1px_2px_rgba(20,22,30,.08)]' : 'text-ink-2 hover:text-ink')}
                  >
                    {item.label}
                    <span className="font-mono text-[11px] text-ink-3">{countWords(drafts[item.id] ?? '')}</span>
                  </button>
                ))}
              </div>
            )}
            <TaskBrief task={task} />
          </div>
          <Editor key={task.id} task={task} value={drafts[task.id] ?? ''} onChange={(text) => update(task.id, text)} />
        </div>
      </div>
      <footer className="flex shrink-0 items-center justify-end gap-2 bg-surface px-6 py-3 shadow-[0_-1px_0_rgba(20,22,30,.06)]">
        <Button size="md" arrow onClick={submit} className="min-w-[180px]">{t('writing.submit')}</Button>
      </footer>
      <Dialog open={shortWarning !== null} onOpenChange={(open) => !open && setShortWarning(null)}>
        <DialogContent title={t('writing.shortTitle')} description={t('writing.shortMessage', { items: shortWarning ?? '' })} closeLabel={t('common.close')}>
          <div className="grid grid-cols-2 gap-2.5">
            <Button variant="secondary" onClick={() => setShortWarning(null)}>{t('writing.keepWriting')}</Button>
            <Button
              onClick={() => {
                setShortWarning(null);
                finish();
              }}
            >
              {t('writing.submitAnyway')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <SessionDialogs controls={controls} />
    </>
  );
}
