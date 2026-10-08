import { fetchStudyDays as coreFetchStudyDays, logStudy as coreLogStudy, studyKeys } from '@cefr/core';
import { supabase } from '@/shared/api';
import { queryClient } from '@/shared/lib';

export { studyKeys, useStudyDays } from '@cefr/core';

export const fetchStudyDays = () => coreFetchStudyDays(supabase);

export const logStudy = async (seconds: number) => {
  if (await coreLogStudy(supabase, seconds)) await queryClient.invalidateQueries({ queryKey: studyKeys.all });
};
