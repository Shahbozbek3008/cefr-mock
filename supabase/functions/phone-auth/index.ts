import { createClient } from 'npm:@supabase/supabase-js@2';

const OTP_TTL_MS = 5 * 60 * 1000;
const RESEND_MS = 60 * 1000;
const MAX_ATTEMPTS = 5;
const PHONE_PATTERN = /^\+998\d{9}$/;
const CODE_PATTERN = /^\d{6}$/;

const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const testCode = Deno.env.get('OTP_TEST_CODE') ?? '';
const pepper = Deno.env.get('OTP_PEPPER') ?? serviceKey;
const aliasDomain = Deno.env.get('PHONE_EMAIL_DOMAIN') ?? 'phone.cefrmock.app';

const admin = createClient(supabaseUrl, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

type ErrorCode =
  | 'invalid_request'
  | 'invalid_phone'
  | 'invalid_code'
  | 'code_expired'
  | 'too_many_attempts'
  | 'too_many_requests'
  | 'sms_unavailable'
  | 'server_error';

const respond = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

const fail = (error: ErrorCode, status = 400) => respond({ error }, status);

const sha256 = async (value: string) => {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
};

const hashCode = (phone: string, code: string) => sha256(`${phone}:${code}:${pepper}`);

const aliasEmail = (phone: string) => `${phone.slice(1)}@${aliasDomain}`;

const requestCode = async (phone: string) => {
  const { data: last } = await admin
    .from('otp_requests')
    .select('created_at')
    .eq('phone', phone)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (last && Date.now() - new Date(last.created_at).getTime() < RESEND_MS) return fail('too_many_requests', 429);
  if (!testCode) return fail('sms_unavailable', 503);

  const { error } = await admin.from('otp_requests').insert({
    phone,
    code_hash: await hashCode(phone, testCode),
    expires_at: new Date(Date.now() + OTP_TTL_MS).toISOString(),
  });
  if (error) return fail('server_error', 500);

  return respond({ ok: true, resendIn: RESEND_MS / 1000 });
};

const findOrCreateUser = async (phone: string) => {
  const { data: profile } = await admin.from('profiles').select('id').eq('phone', phone).maybeSingle();
  if (profile) return aliasEmail(phone);

  const { error } = await admin.auth.admin.createUser({
    email: aliasEmail(phone),
    email_confirm: true,
    user_metadata: { phone },
  });
  if (error && !/already/i.test(error.message)) throw error;
  return aliasEmail(phone);
};

const createSession = async (email: string) => {
  const { data: link, error: linkError } = await admin.auth.admin.generateLink({ type: 'magiclink', email });
  if (linkError || !link.properties?.hashed_token) throw linkError ?? new Error('link_failed');

  const { data, error } = await admin.auth.verifyOtp({ type: 'magiclink', token_hash: link.properties.hashed_token });
  if (error || !data.session) throw error ?? new Error('session_failed');
  return data.session;
};

const verifyCode = async (phone: string, code: string) => {
  const { data: request } = await admin
    .from('otp_requests')
    .select('id, code_hash, attempts, expires_at')
    .eq('phone', phone)
    .is('consumed_at', null)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!request || new Date(request.expires_at).getTime() < Date.now()) return fail('code_expired');
  if (request.attempts >= MAX_ATTEMPTS) return fail('too_many_attempts', 429);

  if ((await hashCode(phone, code)) !== request.code_hash) {
    await admin
      .from('otp_requests')
      .update({ attempts: request.attempts + 1 })
      .eq('id', request.id);
    return fail('invalid_code');
  }

  await admin.from('otp_requests').update({ consumed_at: new Date().toISOString() }).eq('id', request.id);

  const session = await createSession(await findOrCreateUser(phone));
  return respond({
    access_token: session.access_token,
    refresh_token: session.refresh_token,
  });
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return fail('invalid_request', 405);

  try {
    const body = await req.json().catch(() => null);
    const phone = typeof body?.phone === 'string' ? body.phone : '';
    if (!PHONE_PATTERN.test(phone)) return fail('invalid_phone');

    if (body.action === 'request') return await requestCode(phone);
    if (body.action === 'verify') {
      const code = typeof body.code === 'string' ? body.code : '';
      if (!CODE_PATTERN.test(code)) return fail('invalid_code');
      return await verifyCode(phone, code);
    }
    return fail('invalid_request');
  } catch {
    return fail('server_error', 500);
  }
});
