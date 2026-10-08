type ServiceAccount = { project_id: string; client_email: string; private_key: string };

type CachedToken = { value: string; expiresAt: number };

export type PushMessage = { title: string; body: string; url: string | null };

export type PushResult = 'sent' | 'unregistered' | 'failed';

export type PushPlatform = 'mobile' | 'web';

const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const SCOPE = 'https://www.googleapis.com/auth/firebase.messaging';
const TOKEN_TTL_SEC = 3600;
const REFRESH_MARGIN_MS = 60_000;

const account = JSON.parse(atob(Deno.env.get('FCM_SERVICE_ACCOUNT') ?? '')) as ServiceAccount;
let cached: CachedToken | null = null;

const base64Url = (data: ArrayBuffer | string) => {
  const bytes = typeof data === 'string' ? new TextEncoder().encode(data) : new Uint8Array(data);
  let binary = '';
  bytes.forEach((byte) => (binary += String.fromCharCode(byte)));
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

const importKey = (pem: string) => {
  const body = pem.replace(/-----[^-]+-----/g, '').replace(/\s+/g, '');
  const der = Uint8Array.from(atob(body), (char) => char.charCodeAt(0));
  return crypto.subtle.importKey('pkcs8', der, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['sign']);
};

const signedAssertion = async () => {
  const issuedAt = Math.floor(Date.now() / 1000);
  const header = base64Url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claims = base64Url(
    JSON.stringify({
      iss: account.client_email,
      scope: SCOPE,
      aud: TOKEN_URL,
      iat: issuedAt,
      exp: issuedAt + TOKEN_TTL_SEC,
    }),
  );
  const unsigned = `${header}.${claims}`;
  const signature = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    await importKey(account.private_key),
    new TextEncoder().encode(unsigned),
  );
  return `${unsigned}.${base64Url(signature)}`;
};

const accessToken = async () => {
  if (cached && cached.expiresAt - REFRESH_MARGIN_MS > Date.now()) return cached.value;

  const response = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: await signedAssertion(),
    }),
  });
  if (!response.ok) throw new Error(`oauth_${response.status}`);

  const payload = (await response.json()) as { access_token: string; expires_in: number };
  cached = { value: payload.access_token, expiresAt: Date.now() + payload.expires_in * 1000 };
  return cached.value;
};

const isUnregistered = (status: number, body: string) => status === 404 || body.includes('UNREGISTERED');

const mobileMessage = (token: string, message: PushMessage) => ({
  token,
  notification: { title: message.title, body: message.body },
  data: message.url ? { url: message.url } : {},
  android: { priority: 'HIGH', notification: { sound: 'default' } },
  apns: { payload: { aps: { sound: 'default' } } },
});

const webMessage = (token: string, message: PushMessage) => ({
  token,
  data: { title: message.title, body: message.body, url: message.url ?? '/app' },
  webpush: { headers: { Urgency: 'high' } },
});

export const sendPush = async (token: string, platform: PushPlatform, message: PushMessage): Promise<PushResult> => {
  const response = await fetch(`https://fcm.googleapis.com/v1/projects/${account.project_id}/messages:send`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${await accessToken()}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: platform === 'web' ? webMessage(token, message) : mobileMessage(token, message) }),
  });
  if (response.ok) return 'sent';
  return isUnregistered(response.status, await response.text()) ? 'unregistered' : 'failed';
};
