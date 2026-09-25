import { useCallback, useEffect, useRef, useState } from 'react';
import {
  RecordingPresets,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
  useAudioRecorder,
  useAudioRecorderState,
} from 'expo-audio';
import type { SpeakingQuestion } from '@/entities/test';
import { useSecondsLeft } from '@/shared/lib';

export type RecorderPhase = 'pending' | 'prep' | 'recording' | 'done' | 'denied';

const WAVE_BARS = 24;

const METER_MS = 120;
const SILENCE_DB = -60;

const toLevel = (db: number | undefined) =>
  db === undefined ? 0.5 : Math.max(0.08, Math.min(1, (db - SILENCE_DB) / -SILENCE_DB));

export const useAnswerRecorder = (question: SpeakingQuestion, onSaved: (uri: string) => void) => {
  const recorder = useAudioRecorder({ ...RecordingPresets.HIGH_QUALITY, isMeteringEnabled: true });
  const recorderState = useAudioRecorderState(recorder, METER_MS);
  const [phase, setPhase] = useState<RecorderPhase>('pending');
  const [endsAt, setEndsAt] = useState(0);
  const [bars, setBars] = useState<number[]>([]);
  const [recorded, setRecorded] = useState(0);
  const savedRef = useRef(onSaved);
  savedRef.current = onSaved;

  const start = useCallback(async () => {
    await recorder.prepareToRecordAsync();
    recorder.record();
    setBars([]);
    setPhase('recording');
    setEndsAt(Date.now() + question.answerSec * 1000);
  }, [question.answerSec, recorder]);

  const stop = useCallback(async () => {
    const startedAt = endsAt - question.answerSec * 1000;
    setRecorded(Math.min(question.answerSec, Math.max(0, (Date.now() - startedAt) / 1000)));
    await recorder.stop();
    setPhase('done');
    if (recorder.uri) savedRef.current(recorder.uri);
  }, [endsAt, question.answerSec, recorder]);

  const restart = useCallback(async () => {
    if (recorder.isRecording) await recorder.stop();
    setBars([]);
    setPhase('prep');
    setEndsAt(Date.now() + question.prepSec * 1000);
  }, [question.prepSec, recorder]);

  const onDeadline = useCallback(() => {
    if (phase === 'prep') start();
    if (phase === 'recording') stop();
  }, [phase, start, stop]);

  const secondsLeft = useSecondsLeft(endsAt, onDeadline);

  useEffect(() => {
    let active = true;
    (async () => {
      const permission = await requestRecordingPermissionsAsync();
      if (!active) return;
      if (!permission.granted) {
        setPhase('denied');
        return;
      }
      await setAudioModeAsync({ playsInSilentMode: true, allowsRecording: true });
      if (!active) return;
      setPhase('prep');
      setEndsAt(Date.now() + question.prepSec * 1000);
    })();
    return () => {
      active = false;
    };
  }, [question.prepSec]);

  useEffect(() => {
    if (phase !== 'recording') return;
    const elapsed = question.answerSec - secondsLeft;
    const bucket = Math.min(WAVE_BARS - 1, Math.floor((elapsed / question.answerSec) * WAVE_BARS));
    const level = toLevel(recorderState.metering);
    setBars((current) => {
      const next = [...current];
      next[bucket] = Math.max(next[bucket] ?? 0, level);
      return next;
    });
  }, [phase, question.answerSec, recorderState.metering, secondsLeft]);

  const elapsed = phase === 'recording' ? question.answerSec - secondsLeft : phase === 'done' ? recorded : 0;

  return { phase, secondsLeft, elapsed, bars, start, stop, restart };
};
