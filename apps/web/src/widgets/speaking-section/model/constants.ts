import { Headphones, type LucideIcon, Mic, MicOff, MonitorX } from 'lucide-react';
import type { MicIssue } from './types';

export const WAVE_BARS = 24;

export const ISSUE_ICONS: Record<MicIssue, LucideIcon> = { denied: MicOff, missing: Headphones, busy: Mic, unsupported: MonitorX };

export const METER_MS = 120;

export const MIME_TYPES = ['audio/mp4', 'audio/webm;codecs=opus', 'audio/webm', 'audio/ogg'];
