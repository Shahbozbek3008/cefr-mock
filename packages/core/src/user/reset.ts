import type { CefrClient } from '../api/client';
import { unwrap } from '../api/errors';

const RECORDINGS_BUCKET = 'recordings';

export const resetProgress = async (client: CefrClient) => {
  const recordings = unwrap(await client.rpc('reset_progress'));
  if (recordings.length) await client.storage.from(RECORDINGS_BUCKET).remove(recordings).catch(() => undefined);
};
