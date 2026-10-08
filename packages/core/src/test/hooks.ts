import { useQuery } from '@tanstack/react-query';
import { useCefrClient } from '../api/client';
import { fetchTest, fetchTestKeys, fetchTestScripts, fetchTests, testKeys } from './api';

export const useTests = () => {
  const client = useCefrClient();
  return useQuery({ queryKey: testKeys.all, queryFn: () => fetchTests(client) });
};

export const useTest = (id: string) => {
  const client = useCefrClient();
  return useQuery({ queryKey: testKeys.detail(id), queryFn: () => fetchTest(client, id), staleTime: Infinity, enabled: id !== '' });
};

export const useTestKeys = (id: string) => {
  const client = useCefrClient();
  return useQuery({ queryKey: testKeys.answers(id), queryFn: () => fetchTestKeys(client, id), enabled: id !== '' });
};

export const useTestScripts = (id: string) => {
  const client = useCefrClient();
  return useQuery({ queryKey: testKeys.scripts(id), queryFn: () => fetchTestScripts(client, id), enabled: id !== '' });
};
