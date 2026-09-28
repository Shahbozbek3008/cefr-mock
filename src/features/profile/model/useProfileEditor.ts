import { useCallback, useMemo, useState } from 'react';
import { fetchProfile, removeAvatar, updateProfile, uploadAvatar, useUserStore } from '@/entities/user/model';

const MIN_NAME_LENGTH = 2;

export type AvatarDraft =
  { kind: 'current'; uri: string | null } | { kind: 'picked'; uri: string } | { kind: 'removed' };

const normalize = (value: string) => value.trim().replace(/\s+/g, ' ');

const resolveAvatarPath = async (draft: AvatarDraft, currentPath: string | null) => {
  if (draft.kind === 'picked') return uploadAvatar(draft.uri);
  if (draft.kind === 'removed') return null;
  return currentPath;
};

export const useProfileEditor = () => {
  const user = useUserStore((s) => s.user);
  const applyProfile = useUserStore((s) => s.applyProfile);
  const [firstName, setFirstName] = useState(user?.firstName ?? '');
  const [lastName, setLastName] = useState(user?.lastName ?? '');
  const [avatar, setAvatar] = useState<AvatarDraft>({ kind: 'current', uri: user?.avatarUrl ?? null });
  const [saving, setSaving] = useState(false);

  const avatarUri = avatar.kind === 'removed' ? null : avatar.uri;
  const valid = normalize(firstName).length >= MIN_NAME_LENGTH;

  const dirty = useMemo(
    () =>
      avatar.kind !== 'current' ||
      normalize(firstName) !== (user?.firstName ?? '') ||
      normalize(lastName) !== (user?.lastName ?? ''),
    [avatar.kind, firstName, lastName, user?.firstName, user?.lastName],
  );

  const pickPhoto = useCallback((uri: string) => setAvatar({ kind: 'picked', uri }), []);
  const removePhoto = useCallback(() => setAvatar({ kind: 'removed' }), []);

  const save = useCallback(async () => {
    setSaving(true);
    try {
      const current = await fetchProfile();
      const avatarPath = await resolveAvatarPath(avatar, current.avatarPath);
      await updateProfile({ firstName: normalize(firstName), lastName: normalize(lastName), avatarPath });
      if (current.avatarPath && current.avatarPath !== avatarPath) {
        removeAvatar(current.avatarPath).catch(() => undefined);
      }
      applyProfile(await fetchProfile());
    } finally {
      setSaving(false);
    }
  }, [applyProfile, avatar, firstName, lastName]);

  return {
    phone: user?.phone ?? '',
    firstName,
    lastName,
    avatarUri,
    displayName: normalize(`${firstName} ${lastName}`) || (user?.name ?? ''),
    valid,
    dirty,
    saving,
    setFirstName,
    setLastName,
    pickPhoto,
    removePhoto,
    save,
  };
};
