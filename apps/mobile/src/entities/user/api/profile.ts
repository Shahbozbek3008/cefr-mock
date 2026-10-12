import { fetchProfile as coreFetchProfile, updateProfile as coreUpdateProfile } from '@cefr/core';
import type { ProfilePatch } from '@cefr/core';
import { supabase } from '@/shared/api';

export type { Profile, ProfilePatch } from '@cefr/core';

export const fetchProfile = () => coreFetchProfile(supabase);

export const updateProfile = (patch: ProfilePatch) => coreUpdateProfile(supabase, patch);
