import { useQuery } from '@tanstack/react-query';
import { useCefrClient } from '../api/client';
import { fetchProfile, profileKeys } from './api';

export const useProfile = () => {
  const client = useCefrClient();
  return useQuery({ queryKey: profileKeys.me, queryFn: () => fetchProfile(client) });
};
