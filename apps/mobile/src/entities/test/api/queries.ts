import {
  fetchTest as coreFetchTest,
  fetchTestKeys as coreFetchTestKeys,
  fetchTestScripts as coreFetchTestScripts,
  fetchTests as coreFetchTests,
  listeningAudioUrl as coreListeningAudioUrl,
} from '@cefr/core';
import { supabase } from '@/shared/api';

export { testKeys, useTest, useTestKeys, useTestScripts, useTests } from '@cefr/core';

export const fetchTests = () => coreFetchTests(supabase);

export const fetchTest = (id: string) => coreFetchTest(supabase, id);

export const fetchTestKeys = (id: string) => coreFetchTestKeys(supabase, id);

export const fetchTestScripts = (id: string) => coreFetchTestScripts(supabase, id);

export const listeningAudioUrl = (file: string) => coreListeningAudioUrl(supabase, file);
