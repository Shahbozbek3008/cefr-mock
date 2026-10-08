import type { CefrClient } from '../api/client';
import type { Database, Tables } from '../api/database';
import { ensureOk, requireUserId, unwrap } from '../api/errors';
import type { DailyMinutes, TargetLevel } from './types';

export type Locale = 'uz' | 'ru' | 'en';

export type Profile = {
  id: string;
  phone: string | null;
  firstName: string;
  lastName: string;
  avatarPath: string | null;
  avatarUrl: string | null;
  targetLevel: TargetLevel | null;
  examDate: string | null;
  dailyMinutes: DailyMinutes | null;
  reminderEnabled: boolean;
  isPro: boolean;
  locale: Locale;
  createdAt: string;
};

export type ProfilePatch = Partial<
  Pick<Profile, 'firstName' | 'lastName' | 'avatarPath' | 'targetLevel' | 'examDate' | 'dailyMinutes' | 'reminderEnabled'> & {
    pushToken: string | null;
    locale: Locale;
  }
>;

type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

const AVATARS_BUCKET = 'avatars';
const AVATAR_CONTENT_TYPE = 'image/jpeg';

export const avatarUrl = (client: CefrClient, path: string) =>
  client.storage.from(AVATARS_BUCKET).getPublicUrl(path).data.publicUrl;

const toProfile = (client: CefrClient, row: Tables<'profiles'>): Profile => ({
  id: row.id,
  phone: row.phone,
  firstName: row.first_name ?? '',
  lastName: row.last_name ?? '',
  avatarPath: row.avatar_path,
  avatarUrl: row.avatar_path ? avatarUrl(client, row.avatar_path) : null,
  targetLevel: row.target_level as TargetLevel | null,
  examDate: row.exam_date,
  dailyMinutes: row.daily_minutes as DailyMinutes | null,
  reminderEnabled: row.reminder_enabled,
  isPro: row.is_pro,
  locale: row.locale,
  createdAt: row.created_at,
});

const clean = (value: string) => value.trim().replace(/\s+/g, ' ') || null;

const toUpdate = (patch: ProfilePatch): ProfileUpdate => {
  const update: ProfileUpdate = {};
  if (patch.firstName !== undefined) update.first_name = clean(patch.firstName);
  if (patch.lastName !== undefined) update.last_name = clean(patch.lastName);
  if (patch.avatarPath !== undefined) update.avatar_path = patch.avatarPath;
  if (patch.targetLevel !== undefined) update.target_level = patch.targetLevel;
  if (patch.examDate !== undefined) update.exam_date = patch.examDate;
  if (patch.dailyMinutes !== undefined) update.daily_minutes = patch.dailyMinutes;
  if (patch.reminderEnabled !== undefined) update.reminder_enabled = patch.reminderEnabled;
  if (patch.pushToken !== undefined) update.push_token = patch.pushToken;
  if (patch.locale !== undefined) update.locale = patch.locale;
  return update;
};

export const fetchProfile = async (client: CefrClient) =>
  toProfile(
    client,
    unwrap(
      await client
        .from('profiles')
        .select('*')
        .eq('id', await requireUserId(client))
        .single(),
    ),
  );

export const updateProfile = async (client: CefrClient, patch: ProfilePatch) => {
  const update = toUpdate(patch);
  if (Object.keys(update).length === 0) return;
  ensureOk(
    await client
      .from('profiles')
      .update(update)
      .eq('id', await requireUserId(client)),
  );
};

export const uploadAvatar = async (client: CefrClient, body: ArrayBuffer | Blob) => {
  const path = `${await requireUserId(client)}/${Date.now()}.jpg`;
  ensureOk(await client.storage.from(AVATARS_BUCKET).upload(path, body, { contentType: AVATAR_CONTENT_TYPE }));
  return path;
};

export const removeAvatar = async (client: CefrClient, path: string) => {
  ensureOk(await client.storage.from(AVATARS_BUCKET).remove([path]));
};

export const profileKeys = {
  me: ['profile'] as const,
};
