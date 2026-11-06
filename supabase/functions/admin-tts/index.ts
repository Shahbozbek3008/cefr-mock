import { createClient } from 'npm:@supabase/supabase-js@2';

const SAMPLE_RATE = 24000;
const MAX_TEXT = 2000;

const voices: Record<string, string> = {
  narrator: 'aura-2-draco-en',
  woman: 'aura-2-thalia-en',
  man: 'aura-2-apollo-en',
  woman2: 'aura-2-luna-en',
  man2: 'aura-2-orion-en',
  woman3: 'aura-2-pandora-en',
  man3: 'aura-2-zeus-en',
};

const admin = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '', {
  auth: { autoRefreshToken: false, persistSession: false },
});

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const respond = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

const isAdmin = async (req: Request) => {
  const token = req.headers.get('Authorization')?.replace(/^Bearer\s+/i, '') ?? '';
  const { data: auth } = await admin.auth.getUser(token);
  if (!auth.user) return false;
  const { data } = await admin.from('profiles').select('is_admin').eq('id', auth.user.id).maybeSingle();
  return data?.is_admin === true;
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return respond({ error: 'invalid_request' }, 405);
  if (!(await isAdmin(req))) return respond({ error: 'forbidden' }, 403);

  const body = await req.json().catch(() => null);
  const model = voices[typeof body?.voice === 'string' ? body.voice : ''];
  const text = typeof body?.text === 'string' ? body.text.trim() : '';
  if (!model || !text || text.length > MAX_TEXT) return respond({ error: 'invalid_request' }, 400);

  const apiKey = Deno.env.get('DEEPGRAM_API_KEY') ?? '';
  if (!apiKey) return respond({ error: 'not_configured' }, 503);

  const upstream = await fetch(
    `https://api.deepgram.com/v1/speak?model=${model}&encoding=linear16&sample_rate=${SAMPLE_RATE}&container=none`,
    {
      method: 'POST',
      headers: { Authorization: `Token ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    },
  );
  if (!upstream.ok) return respond({ error: 'tts_failed', status: upstream.status }, 502);

  return new Response(upstream.body, {
    headers: { ...corsHeaders, 'Content-Type': 'application/octet-stream' },
  });
});
