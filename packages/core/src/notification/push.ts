import type { CefrClient } from '../api/client';
import { ensureOk } from '../api/errors';

export type PushPlatform = 'mobile' | 'web';

export const registerPushToken = async (client: CefrClient, token: string, platform: PushPlatform) => {
  ensureOk(await client.rpc('register_push_token', { push_token: token, push_platform: platform }));
};

export const unregisterPushToken = async (client: CefrClient, token: string) => {
  ensureOk(await client.rpc('unregister_push_token', { push_token: token }));
};
