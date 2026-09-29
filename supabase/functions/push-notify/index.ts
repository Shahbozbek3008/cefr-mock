import { createClient } from 'npm:@supabase/supabase-js@2';
import { sendPush } from './fcm.ts';
import { renderMessage, toLocale } from './messages.ts';
import type { NotificationKind } from './messages.ts';

const FRESH_WINDOW_MS = 10 * 60 * 1000;

const admin = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '', {
  auth: { autoRefreshToken: false, persistSession: false },
});

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
    if (!profile?.push_token || !profile.reminder_enabled) return respond({ status: 'no_token' });

    const content = renderMessage(
      notification.kind as NotificationKind,
      toLocale(profile.locale),
      (notification.params ?? {}) as Record<string, unknown>,
    );
    const result = await sendPush(profile.push_token, { ...content, url: notification.url });

    if (result === 'unregistered') {
      await admin.from('profiles').update({ push_token: null }).eq('id', notification.user_id);
    }
    return respond({ status: result });
  } catch (error) {
    return respond({ error: error instanceof Error ? error.message : 'server_error' }, 500);
  }
});
