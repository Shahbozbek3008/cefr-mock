import type { CefrClient } from '../api/client';
import { requireUserId, unwrap } from '../api/errors';
import type { SectionKind } from '../test/types';

export const fetchPracticeTest = async (client: CefrClient, section: SectionKind) => {
  const userId = await requireUserId(client);
  const [tests, active, practiced, profile] = await Promise.all([
    client.from('tests').select('id, is_pro').order('published_at', { ascending: false }).order('number', { ascending: false }),
    client.from('attempts').select('test_id').eq('scope', section).eq('status', 'in_progress').order('updated_at', { ascending: false }).limit(1),
    client.from('results').select('test_id').eq('scope', section),
    client.from('profiles').select('is_pro').eq('id', userId).single(),
  ]);

  const resume = unwrap(active)[0];
  if (resume) return resume.test_id;

  const isPro = unwrap(profile).is_pro;
  const available = unwrap(tests).filter((test) => isPro || !test.is_pro);
  if (available.length === 0) return null;

  const done = new Set(unwrap(practiced).map((row) => row.test_id));
  return (available.find((test) => !done.has(test.id)) ?? available[0]).id;
};
