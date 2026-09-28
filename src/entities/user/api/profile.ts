import { ensureOk, requireUserId, supabase, unwrap } from '@/shared/api';
import type { Database, Tables } from '@/shared/api';
import type { DailyMinutes, TargetLevel } from '../model/types';

export type Profile = {
  id: string;
  phone: string | null;
  name: string;
  targetLevel: TargetLevel | null;
  examDate: string | null;
  dailyMinutes: DailyMinutes | null;
  reminderEnabled: boolean;
  isPro: boolean;
};

export type ProfilePatch = Partial<
  Pick<Profile, 'name' | 'targetLevel' | 'examDate' | 'dailyMinutes' | 'reminderEnabled'> & { pushToken: string | null }
>;

type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

const toProfile = (row: Tables<'profiles'>): Profile => ({
  id: row.id,
  phone: row.phone,
  name: row.name ?? '',
  targetLevel: row.target_level as TargetLevel | null,
  examDate: row.exam_date,
  dailyMinutes: row.daily_minutes as DailyMinutes | null,
  reminderEnabled: row.reminder_enabled,
  isPro: row.is_pro,
});

const toUpdate = (patch: ProfilePatch): ProfileUpdate => {
  const update: ProfileUpdate = {};
  if (patch.name !== undefined) update.name = patch.name.trim() || null;
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
