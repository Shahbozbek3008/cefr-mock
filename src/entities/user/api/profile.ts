import { ensureOk, requireUserId, supabase, unwrap } from '@/shared/api';
import type { Database, Tables } from '@/shared/api';
import type { DailyMinutes, TargetLevel } from '../model/types';
import { avatarUrl } from './avatar';

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
};

export type ProfilePatch = Partial<
  Pick<
    Profile,
    'firstName' | 'lastName' | 'avatarPath' | 'targetLevel' | 'examDate' | 'dailyMinutes' | 'reminderEnabled'
  > & { pushToken: string | null }
>;

type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

const toProfile = (row: Tables<'profiles'>): Profile => ({
  id: row.id,
  phone: row.phone,
  firstName: row.first_name ?? '',
  lastName: row.last_name ?? '',
  avatarPath: row.avatar_path,
  avatarUrl: row.avatar_path ? avatarUrl(row.avatar_path) : null,
  targetLevel: row.target_level as TargetLevel | null,
  examDate: row.exam_date,
  dailyMinutes: row.daily_minutes as DailyMinutes | null,
  reminderEnabled: row.reminder_enabled,
  isPro: row.is_pro,
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
  return update;
};

export const fetchProfile = async () =>
  toProfile(
    unwrap(
      await supabase
        .from('profiles')
        .select('*')
        .eq('id', await requireUserId())
        .single(),
    ),
  );

export const updateProfile = async (patch: ProfilePatch) => {
  const update = toUpdate(patch);
  if (Object.keys(update).length === 0) return;
  ensureOk(
    await supabase
      .from('profiles')
      .update(update)
      .eq('id', await requireUserId()),
  );
};
