'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { listeningAudioUrl, useCefrClient, type Choice, type MapSpec, type McqQuestion, type Question, type TestDetail } from '@cefr/core';
import { cn } from '@/lib/cn';
import { useAttemptStore } from '@/lib/attempt-store';
import { useSessionControls } from '@/lib/exam/session';
import { Button } from '@/components/ui/button';
import { AudioPlayer } from './audio-player';
import { ExamHeader, SectionTimer } from './exam-header';
import { SessionDialogs } from './session-dialogs';
import { FlagButton, GapInput, InstructionBlock, MatchChips, McqOptions, QuestionNavigator } from './question-inputs';

const card = 'rounded-card-sm bg-surface shadow-[0_0_0_1px_rgba(20,22,30,.06),0_1px_2px_rgba(20,22,30,.04)]';
const qTag = (current: boolean) =>
  cn('rounded-[7px] px-1.5 py-0.5 font-mono text-[11px] font-medium', current ? 'bg-green-100 text-green-text' : 'bg-surface-sunken text-ink-2');

function MapCard({ map }: { map: MapSpec }) {
  return (
    <div className={cn(card, 'p-3')}>
      <svg viewBox={`0 0 ${map.width} ${map.height}`} className="h-auto w-full" role="img">
        {map.roads.map((road, i) => (
          <polyline key={`r${i}`} points={road.points.map(([x, y]) => `${x},${y}`).join(' ')} fill="none" stroke="var(--surface-sunken)" strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" />
        ))}
        {map.blocks.map((b, i) => (
          <g key={`b${i}`}>
            <rect x={b.x} y={b.y} width={b.w} height={b.h} rx={4} fill={b.letter ? 'var(--green-50)' : 'var(--surface-muted)'} stroke={b.letter ? 'var(--green-500)' : 'var(--border)'} />
            {b.letter && <text x={b.x + b.w / 2} y={b.y + b.h / 2 + 5} fontSize={15} fontWeight={600} fill="var(--green-text)" textAnchor="middle">{b.letter}</text>}
            {b.name && <text x={b.x + b.w / 2} y={b.y + b.h / 2 + 3} fontSize={10} fontWeight={500} fill="var(--text-2)" textAnchor="middle">{b.name}</text>}
          </g>
        ))}
        {(map.labels ?? []).map((l, i) => (
          <text key={`l${i}`} x={l.x} y={l.y} fontSize={10} fill="var(--text-3)" textAnchor="middle">{l.text}</text>
        ))}
      </svg>
    </div>
  );
}

type QuestionsProps = { questions: Question[]; currentId: string; onFocus: (id: string) => void; register: (id: string, el: HTMLElement | null) => void };

function NotesCard({ title, questions, onFocus, register }: QuestionsProps & { title: string }) {
  return (
    <div className={cn(card, 'flex flex-col px-6 py-5')}>
      <span className="pb-2 text-[17px] font-medium tracking-[-0.02em]">{title}</span>
      {questions.map((q) => (
        <div key={q.id} ref={(el) => register(q.id, el)} className="grid min-h-14 items-center gap-x-5 gap-y-2 py-2 text-[15px] shadow-[0_1px_0_var(--divider)] last:shadow-none sm:grid-cols-[minmax(0,1fr)_auto]">
          <span className="text-ink-body">{q.prompt}</span>
          <GapInput questionId={q.id} number={q.number} onFocus={onFocus} />
        </div>
      ))}
    </div>
  );
}

function ChoicesCard({ choices }: { choices: Choice[] }) {
  return (
    <div className={cn(card, 'grid gap-x-6 gap-y-2 px-6 py-4 sm:grid-cols-2')}>
      {choices.map((c) => (
        <span key={c.key} className="flex gap-3 text-sm">
          <span className="font-mono text-[13px] font-medium text-ink-2">{c.key}</span>
          <span className="text-ink-body">{c.text}</span>
        </span>
      ))}
    </div>
  );
}

function MatchCard({ choices, questions, currentId, onFocus, register }: QuestionsProps & { choices: Choice[] }) {
  return (
    <div className={cn(card, 'flex flex-col px-6 py-2')}>
      {questions.map((q) => (
        <div key={q.id} ref={(el) => register(q.id, el)} className="flex flex-wrap items-center justify-between gap-3 py-3.5 shadow-[0_1px_0_var(--divider)] last:shadow-none">
          <span className="flex items-center gap-2.5 text-[15px]">
            <span className={qTag(q.id === currentId)}>Q{q.number}</span>
            {q.prompt}
          </span>
          <MatchChips questionId={q.id} choices={choices} onAnswer={onFocus} />
        </div>
      ))}
    </div>
  );
}

function McqList({ questions, currentId, onFocus, register }: QuestionsProps) {
  return (
    <div className="flex flex-col gap-3">
      {questions.map((q, i) =>
        q.kind === 'mcq' ? (
          <div key={q.id} ref={(el) => register(q.id, el)} className="flex flex-col gap-2">
            {q.group && q.group !== questions[i - 1]?.group && <span className="px-1 text-xs font-medium text-ink-2">{q.group}</span>}
            <div className={cn(card, 'flex flex-col gap-3 p-5')}>
              <span className="flex items-center gap-2.5 text-[15px] font-medium">
                <span className={qTag(q.id === currentId)}>Q{q.number}</span>
                {q.prompt}
              </span>
              <McqOptions question={q as McqQuestion} onAnswer={onFocus} />
            </div>
          </div>
        ) : null,
      )}
    </div>
  );
}

export function ListeningSection({ test }: { test: TestDetail }) {
  const t = useTranslations('exam');
  const client = useCefrClient();
  const parts = test.listening;
  const questions = useMemo(() => parts.flatMap((p) => p.questions), [parts]);
  const controls = useSessionControls(test, 'listening', questions);
  const setPosition = useAttemptStore((s) => s.setPosition);
  const playedParts = useAttemptStore((s) => s.playedParts);
  const markPartPlayed = useAttemptStore((s) => s.markPartPlayed);
  const [currentId, setCurrentId] = useState(() => questions[useAttemptStore.getState().position.listening ?? 0]?.id ?? questions[0].id);
  const nodes = useRef<Record<string, HTMLElement | null>>({});

  const currentIndex = questions.findIndex((q) => q.id === currentId);
  const partIndex = parts.findIndex((p) => p.questions.some((q) => q.id === currentId));
  const part = parts[partIndex];
  const next = questions[currentIndex + 1];
  const nextInOtherPart = next !== undefined && !part.questions.includes(next);

  useEffect(() => {
    setPosition('listening', currentIndex);
  }, [currentIndex, setPosition]);

  const select = useCallback((id: string) => {
    setCurrentId(id);
    requestAnimationFrame(() => {
      const node = nodes.current[id];
      node?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      node?.querySelector('input')?.focus({ preventScroll: true });
    });
  }, []);

  const register = useCallback((id: string, el: HTMLElement | null) => {
    nodes.current[id] = el;
  }, []);

  const { requestFinish, mode } = controls;

  const goNext = () => (next ? select(next.id) : requestFinish());

  const onAudioEnded = useCallback(() => {
    if (mode !== 'exam') return;
    const following = parts[partIndex + 1];
    if (following) select(following.questions[0].id);
    else requestFinish();
  }, [mode, partIndex, parts, requestFinish, select]);

  const onReview = (number: number) => {
    const target = questions.find((q) => q.number === number);
    if (target) select(target.id);
  };

  const first = part.questions[0].number;
  const last = part.questions[part.questions.length - 1].number;
  const props = { questions: part.questions, currentId, onFocus: setCurrentId, register };

  return (
    <>
      <ExamHeader
        title="Listening"
        subtitle={`Part ${partIndex + 1} / ${parts.length}`}
        section="listening"
        timer={<SectionTimer section="listening" onExpire={controls.finish} />}
        onExit={controls.requestExit}
        onFinish={requestFinish}
      />
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto flex w-full max-w-[860px] flex-col gap-5 px-6 py-6">
          {part.audio && (
            <AudioPlayer
              key={part.id}
              src={listeningAudioUrl(client, part.audio)}
              durationSec={part.durationSec}
              mode={mode}
              played={playedParts.includes(part.id)}
              onStart={() => markPartPlayed(part.id)}
              onEnded={onAudioEnded}
            />
          )}
          <InstructionBlock range={`${first}–${last}`} instruction={part.instruction} emphasis={part.emphasis} />
          {part.title ? (
            <NotesCard title={part.title} {...props} />
          ) : part.choices ? (
            <>
              {part.map ? <MapCard map={part.map} /> : <ChoicesCard choices={part.choices} />}
              <MatchCard choices={part.choices} {...props} />
            </>
          ) : (
            <McqList {...props} />
          )}
        </div>
      </div>
      <footer className="flex shrink-0 flex-wrap items-center gap-3 bg-surface px-6 py-3 shadow-[0_-1px_0_rgba(20,22,30,.06)]">
        <FlagButton questionId={currentId} />
        <div className="min-w-0 flex-1">
          <QuestionNavigator questions={part.questions} currentId={currentId} onSelect={select} />
        </div>
        <Button size="md" arrow onClick={goNext} className="min-w-[180px]">
          {next ? t(nextInOtherPart ? 'session.nextPart' : 'session.nextQuestion') : t('common.finish')}
        </Button>
      </footer>
      <SessionDialogs controls={controls} onReview={onReview} />
    </>
  );
}
