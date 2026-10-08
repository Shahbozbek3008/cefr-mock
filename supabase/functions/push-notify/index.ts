import { createClient } from 'npm:@supabase/supabase-js@2';
import { sendPush, type PushPlatform } from './fcm.ts';
import { renderMessage, toLocale } from './messages.ts';
import type { NotificationKind } from './messages.ts';

const FRESH_WINDOW_MS = 10 * 60 * 1000;

const admin = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '', {
  auth: { autoRefreshToken: false, persistSession: false },
});

type Target = { token: string; platform: PushPlatform };

const webPathOf = (url: string | null) => {
  if (url?.startsWith('/result/')) return url.replace('/result/', '/app/results/');
  if (url?.startsWith('/test/')) return url.replace('/test/', '/app/tests/');
  return '/app';
};

const targetsOf = async (userId: string, legacyToken: string | null): Promise<Target[]> => {
  const { data } = await admin.from('push_tokens').select('token, platform').eq('user_id', userId);
  const targets = (data ?? []) as Target[];
  if (legacyToken && !targets.some((target) => target.token === legacyToken)) targets.push({ token: legacyToken, platform: 'mobile' });
  return targets;
};

const respond = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

const claimNotification = async (id: string) => {
  const { data } = await admin
    .from('notifications')
    .update({ pushed_at: new Date().toISOString() })
    .eq('id', id)
    .is('pushed_at', null)
    .gt('created_at', new Date(Date.now() - FRESH_WINDOW_MS).toISOString())
    .select('user_id, kind, params, url')
    .maybeSingle();
  return data;
};

Deno.serve(async (req) => {
  if (req.method !== 'POST') return respond({ error: 'invalid_request' }, 405);

  const body = await req.json().catch(() => null);
  const notificationId = typeof body?.notificationId === 'string' ? body.notificationId : '';
  if (!notificationId) return respond({ error: 'invalid_request' }, 400);

  try {
    const notification = await claimNotification(notificationId);
    if (!notification) return respond({ status: 'skipped' });

    const { data: profile } = await admin
      .from('profiles')
      .select('push_token, locale, reminder_enabled')
      .eq('id', notification.user_id)
      .single();
    if (!profile?.reminder_enabled) return respond({ status: 'disabled' });

    const targets = await targetsOf(notification.user_id, profile.push_token);
    if (targets.length === 0) return respond({ status: 'no_token' });

    const content = renderMessage(
      notification.kind as NotificationKind,
      toLocale(profile.locale),
      (notification.params ?? {}) as Record<string, unknown>,
    );
    const results = await Promise.all(
      targets.map(async (target) => {
        const url = target.platform === 'web' ? webPathOf(notification.url) : notification.url;
        const result = await sendPush(target.token, target.platform, { ...content, url }).catch(() => 'failed' as const);
        if (result === 'unregistered') {
          await admin.from('push_tokens').delete().eq('token', target.token);
          if (target.token === profile.push_token) {
            await admin.from('profiles').update({ push_token: null }).eq('id', notification.user_id);
          }
        }
        return result;
      }),
    );
    return respond({ status: results.includes('sent') ? 'sent' : (results[0] ?? 'failed'), results });
  } catch (error) {
    return respond({ error: error instanceof Error ? error.message : 'server_error' }, 500);
  }
});
