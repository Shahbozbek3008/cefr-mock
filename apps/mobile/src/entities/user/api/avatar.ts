import {
  avatarUrl as coreAvatarUrl,
  removeAvatar as coreRemoveAvatar,
  uploadAvatar as coreUploadAvatar,
} from '@cefr/core';
import { supabase } from '@/shared/api';

export const avatarUrl = (path: string) => coreAvatarUrl(supabase, path);

export const uploadAvatar = async (uri: string) => coreUploadAvatar(supabase, await (await fetch(uri)).arrayBuffer());

export const removeAvatar = (path: string) => coreRemoveAvatar(supabase, path);
