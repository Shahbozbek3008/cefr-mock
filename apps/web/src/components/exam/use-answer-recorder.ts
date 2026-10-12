'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { SpeakingQuestion } from '@cefr/core';
import { useSecondsLeft } from './use-seconds-left';

export type RecorderPhase = 'pending' | 'prep' | 'recording' | 'done' | 'denied';

export type MicIssue = 'denied' | 'missing' | 'busy' | 'unsupported';

const WAVE_BARS = 24;
const METER_MS = 120;
const MIME_TYPES = ['audio/mp4', 'audio/webm;codecs=opus', 'audio/webm', 'audio/ogg'];

const issueOf = (error: unknown): MicIssue => {
  if (!window.isSecureContext) return 'unsupported';
  const name = error instanceof DOMException ? error.name : '';
  if (name === 'NotAllowedError' || name === 'SecurityError') return 'denied';
  if (name === 'NotFoundError' || name === 'OverconstrainedError') return 'missing';
  if (name === 'NotReadableError' || name === 'AbortError') return 'busy';
  return 'unsupported';
};

const pickMimeType = () => MIME_TYPES.find((type) => typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(type));

export const useAnswerRecorder = (question: SpeakingQuestion, onSaved: (url: string) => void) => {
  const [phase, setPhase] = useState<RecorderPhase>('pending');
  const [endsAt, setEndsAt] = useState<number>();
  const [bars, setBars] = useState<number[]>([]);
  const [recorded, setRecorded] = useState(0);
  const [issue, setIssue] = useState<MicIssue | null>(null);
  const [attempt, setAttempt] = useState(0);
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const startedAtRef = useRef(0);
  const savedRef = useRef(onSaved);

  useEffect(() => {
    savedRef.current = onSaved;
  }, [onSaved]);

  const start = useCallback(() => {
    const stream = streamRef.current;
    if (!stream) return;
    const mimeType = pickMimeType();
    const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
    chunksRef.current = [];
    recorder.ondataavailable = (event) => event.data.size > 0 && chunksRef.current.push(event.data);
    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: recorder.mimeType || mimeType || 'audio/webm' });
      savedRef.current(URL.createObjectURL(blob));
    };
    recorder.start();
    recorderRef.current = recorder;
    startedAtRef.current = Date.now();
    setBars([]);
    setPhase('recording');
    setEndsAt(Date.now() + question.answerSec * 1000);
  }, [question.answerSec]);

  const stop = useCallback(() => {
    const recorder = recorderRef.current;
    if (!recorder || recorder.state === 'inactive') return;
    setRecorded(Math.min(question.answerSec, (Date.now() - startedAtRef.current) / 1000));
    recorder.stop();
    setPhase('done');
    setEndsAt(undefined);
  }, [question.answerSec]);

  const restart = useCallback(() => {
    const recorder = recorderRef.current;
    if (recorder && recorder.state !== 'inactive') {
      recorder.onstop = null;
      recorder.stop();
    }
    setBars([]);
    setPhase('prep');
    setEndsAt(Date.now() + question.prepSec * 1000);
  }, [question.prepSec]);

  const onDeadline = useCallback(() => {
    if (phase === 'prep') start();
    if (phase === 'recording') stop();
  }, [phase, start, stop]);

  const secondsLeft = useSecondsLeft(endsAt, onDeadline);

  const retry = useCallback(() => {
    setIssue(null);
    setPhase('pending');
    setAttempt((value) => value + 1);
  }, []);

  useEffect(() => {
    let active = true;
    if (!navigator.mediaDevices?.getUserMedia) {
      queueMicrotask(() => {
        if (!active) return;
        setIssue('unsupported');
        setPhase('denied');
      });
      return () => {
        active = false;
      };
    }
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        if (!active) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        streamRef.current = stream;
        const context = new AudioContext();
        const analyser = context.createAnalyser();
        analyser.fftSize = 256;
        context.createMediaStreamSource(stream).connect(analyser);
        audioContextRef.current = context;
        analyserRef.current = analyser;
        setPhase('prep');
        setEndsAt(Date.now() + question.prepSec * 1000);
      })
      .catch((error: unknown) => {
        if (!active) return;
        setIssue(issueOf(error));
        setPhase('denied');
      });

    return () => {
      active = false;
      const recorder = recorderRef.current;
      if (recorder && recorder.state !== 'inactive') recorder.stop();
      streamRef.current?.getTracks().forEach((track) => track.stop());
      audioContextRef.current?.close().catch(() => undefined);
    };
  }, [question.prepSec, attempt]);

  useEffect(() => {
    if (phase !== 'denied' || issue !== 'denied') return;
    let status: PermissionStatus | null = null;
    const onChange = () => status?.state === 'granted' && retry();
    navigator.permissions
      ?.query({ name: 'microphone' as PermissionName })
      .then((result) => {
        status = result;
        result.addEventListener('change', onChange);
      })
      .catch(() => undefined);
    return () => status?.removeEventListener('change', onChange);
  }, [issue, phase, retry]);

  useEffect(() => {
    if (phase !== 'recording') return;
    const analyser = analyserRef.current;
    if (!analyser) return;
    const data = new Uint8Array(analyser.fftSize);
    const id = setInterval(() => {
      analyser.getByteTimeDomainData(data);
      const peak = data.reduce((max, value) => Math.max(max, Math.abs(value - 128)), 0) / 128;
      const elapsed = (Date.now() - startedAtRef.current) / 1000;
      const bucket = Math.min(WAVE_BARS - 1, Math.floor((elapsed / question.answerSec) * WAVE_BARS));
      setBars((current) => {
        const next = [...current];
        next[bucket] = Math.max(next[bucket] ?? 0, Math.max(0.08, Math.min(1, peak * 2)));
        return next;
      });
    }, METER_MS);
    return () => clearInterval(id);
  }, [phase, question.answerSec]);

  const elapsed = phase === 'recording' ? question.answerSec - secondsLeft : phase === 'done' ? recorded : 0;

  return { phase, issue, secondsLeft, elapsed, bars, start, stop, restart, retry };
};
