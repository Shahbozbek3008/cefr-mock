export type { Database, Json, Tables } from './api/database';
export { CefrClientProvider, useCefrClient } from './api/client';
export type { CefrClient } from './api/client';
export { ApiError, ensureOk, errorCode, invokeFunction, isNetworkFailure, requireUserId, unwrap } from './api/errors';

export { MAX_SCORE, levelFor, levelNames, levelThresholds, nextLevelGap, toScaled } from './lib/level';
export type { Level } from './lib/level';
export { daysUntil, formatShortDate } from './lib/date';
export { buildMonthGrid, isOfficialExamDay, toIso } from './lib/calendar';
export type { CalendarCell } from './lib/calendar';
export { formatClock, formatHours, formatShortClock, secondsUntil } from './lib/time';

export { AUTH_ERROR_CODES, requestCode, verifyCode } from './auth/api';
export type { AuthErrorCode, CodeRequest } from './auth/api';
export { OTP_LENGTH, PHONE_DIGITS, PHONE_PREFIX, RESEND_SECONDS, formatCountdown, formatPhone, isPhoneComplete, sanitizeDigits } from './auth/phone';

export type * from './test/types';
export { sectionOrder, sectionTitles, tfngChoices } from './test/sections';
export { fetchTest, fetchTestKeys, fetchTestScripts, fetchTests, listeningAudioUrl, testKeys } from './test/api';
export { useTest, useTestKeys, useTestScripts, useTests } from './test/hooks';

export { createAttemptStore, snapshotOf } from './attempt/store';
export type { AttemptActions, AttemptData, AttemptMode, AttemptSnapshot, AttemptState, Highlight } from './attempt/store';
export { MOBILE_RECORDING, recordingFormatOf, fetchActiveAttempt, openAttempt, recordingUrl, saveAttempt, submitAttempt, uploadRecording } from './attempt/api';
export type { RecordingFormat } from './attempt/api';

export type * from './result/types';
export { mapResult, mapResults } from './result/mapResult';
export type { ResultRow } from './result/mapResult';
export { buildProgress } from './result/progress';
export { buildReview, isCorrect, weakestLabel } from './result/review';
export { AI_POLL_MS, fetchAiReview, fetchResult, fetchResults, hasActiveAi, isAiActive, requestAiReview, resultKeys } from './result/api';
export type { ReviewLocale } from './result/api';
export { useAiReviewRequest, useLatestResult, useProgress, useResult, useResults, useSpeakingReview, useWritingReview } from './result/hooks';

export { DEFAULT_DAILY_MINUTES, todayPlanOf, weeklyPlan } from './study/plan';
export type { PlanItem, SectionScores } from './study/plan';
export { dayKey, streakOf, weekDays, weekdayIndex } from './study/streak';
export { fetchStudyDays, logStudy, studyKeys, useStudyDays } from './study/api';

export { DAILY_MINUTES, TARGET_LEVELS } from './user/types';
export type { AuthProvider, DailyMinutes, OnboardingState, TargetLevel, User } from './user/types';
export { avatarUrl, fetchProfile, profileKeys, removeAvatar, updateProfile, uploadAvatar } from './user/api';
export { useProfile, useUpdateProfile } from './user/hooks';
export { resetProgress } from './user/reset';
export { onboardingPatch, studyPlanOf } from './user/onboarding';
export type { OnboardingDraft } from './user/onboarding';
export type { Locale, Profile, ProfilePatch } from './user/api';

export {
  fetchNotifications,
  notificationKeys,
  useClearNotifications,
  useMarkAllRead,
  useMarkRead,
  useNotifications,
  useUnreadCount,
} from './notification/api';
export type { AppNotification, NotificationKind, NotificationParams } from './notification/api';
export { registerPushToken, unregisterPushToken } from './notification/push';
export type { PushPlatform } from './notification/push';

export { sectionStats } from './session/stats';
export type { SectionStats } from './session/stats';
export {
  beginAttempt,
  completeSection,
  createUploadQueue,
  flushAttempt,
  isAttemptOpen,
  nextSection,
  submitSession,
  useAttemptAutosave,
  useAttemptSession,
} from './session/engine';
export type { AttemptStore, RecordingSource, UploadQueue } from './session/engine';

export { applyCatalog, catalogModes, filterOrder, practiceItems } from './catalog/filters';
export { fetchPracticeTest } from './catalog/practice';
export type { CatalogFilter, CatalogMode, CatalogSort, PracticeItem } from './catalog/filters';
