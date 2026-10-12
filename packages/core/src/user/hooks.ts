import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCefrClient } from '../api/client';
import { avatarUrl, fetchProfile, profileKeys, updateProfile, type Profile, type ProfilePatch } from './api';

export const useProfile = () => {
  const client = useCefrClient();
  return useQuery({ queryKey: profileKeys.me, queryFn: () => fetchProfile(client) });
};

export const useUpdateProfile = () => {
  const client = useCefrClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (patch: ProfilePatch) => updateProfile(client, patch),
    onMutate: async (patch) => {
      await queryClient.cancelQueries({ queryKey: profileKeys.me });
      const previous = queryClient.getQueryData<Profile>(profileKeys.me);
      if (previous) {
        const next: Profile = { ...previous, ...patch };
        if (patch.avatarPath !== undefined) next.avatarUrl = patch.avatarPath ? avatarUrl(client, patch.avatarPath) : null;
        queryClient.setQueryData(profileKeys.me, next);
      }
      return { previous };
    },
    onError: (_error, _patch, context) => {
      if (context?.previous) queryClient.setQueryData(profileKeys.me, context.previous);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: profileKeys.me }),
  });
};
