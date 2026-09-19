const TIKTOK_AUTHORIZE_URL = 'https://www.tiktok.com/v2/auth/authorize/';
const TIKTOK_TOKEN_URL = 'https://open.tiktokapis.com/v2/oauth/token/';
const TIKTOK_CREATOR_INFO_URL = 'https://open.tiktokapis.com/v2/post/publish/creator_info/query/';
const TIKTOK_PUBLISH_URL = 'https://open.tiktokapis.com/v2/post/publish/video/init/';
const TIKTOK_STATUS_URL = 'https://open.tiktokapis.com/v2/post/publish/status/fetch/';
const TOKEN_KEY = 'tokens';
const CLOUDFLARE_REDIRECT_URI = 'https://live-wire-entertainment-website.dlyons184.workers.dev/tiktok-callback';
const ALLOWED_ORIGIN = 'https://livewire2332.github.io';

function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'Access-Control-Allow-Origin': ALLOWED_ORIGIN, 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' } });
}

function html(body, status = 200) {
  return new Response(`<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Live Wire Entertainment</title></head><body style="font-family:system-ui;padding:30px"><h1>⚡ Live Wire Entertainment</h1>${body}<p><a href="https://livewire2332.github.io/Live-Wire-Entertainment-website/">Back to Live Wire Entertainment</a></p></body></html>`, { status, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' } });
}

function redirectUri(env) { return CLOUDFLARE_REDIRECT_URI; }
function requireMethod(request, method) { return request.method === method; }
async function getTokens(env) { return await env.TIKTOK_TOKENS.get(TOKEN_KEY, 'json'); }

async function saveTokens(env, tokens) {
  await env.TIKTOK_TOKENS.put(TOKEN_KEY, JSON.stringify({ access_token: tokens.access_token, refresh_token: tokens.refresh_token, expires_in: Number(tokens.expires_in || 0), refresh_expires_in: Number(tokens.refresh_expires_in || 0), open_id: tokens.open_id || null, scope: tokens.scope || '', saved_at: Date.now() }));
}

async function refreshTokens(env, tokens) {
  if (!tokens?.refresh_token) throw new Error('TikTok session has expired. Please connect TikTok again.');
  const response = await fetch(TIKTOK_TOKEN_URL, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Cache-Control': 'no-cache' }, body: new URLSearchParams({ client_key: env.TIKTOK_CLIENT_KEY, client_secret: env.TIKTOK_CLIENT_SECRET, grant_type: 'refresh_token', refresh_token: tokens.refresh_token }) });
  const payload = await response.json().catch(() => null);
  if (!response.ok || !payload || payload.error) throw new Error('TikTok session refresh failed. Please connect TikTok again.');
  await saveTokens(env, payload);
  return payload;
}

async function accessToken(env) {
  let tokens = await getTokens(env);
  if (!tokens?.access_token) throw new Error('TikTok is not connected yet.');
  const age = Date.now() - Number(tokens.saved_at || 0);
  const expiresMs = Math.max(0, Number(tokens.expires_in || 0) * 1000);
  if (expiresMs && age > expiresMs - 120000) tokens = await refreshTokens(env, tokens);
  return tokens.access_token;
}

async function login(request, env) {
  const state = crypto.randomUUID();
  await env.TIKTOK_TOKENS.put(`oauth_state:${state}`, '1', { expirationTtl: 600 });
  const params = new URLSearchParams({ client_key: env.TIKTOK_CLIENT_KEY, response_type: 'code', scope: 'user.info.basic,video.publish,video.upload', redirect_uri: redirectUri(env), state });
  return new Response(null, { status: 302, headers: { Location: `${TIKTOK_AUTHORIZE_URL}?${params}`, 'Cache-Control': 'no-store' } });
}

async function callback(request, env) {
  const url = new URL(request.url);
  const state = url.searchParams.get('state');
  if (!state) return html('<p>❌ This TikTok sign-in link could not be verified. Please start again.</p>', 400);
  const stateKey = `oauth_state:${state}`;
  const validState = await env.TIKTOK_TOKENS.get(stateKey);
  if (validState !== '1') return html('<p>❌ This TikTok sign-in link could not be verified. Please start again.</p>', 400);
  await env.TIKTOK_TOKENS.delete(stateKey);
  if (url.searchParams.get('error') || url.searchParams.get('errCode')) return html('<p>TikTok did not grant access. Nothing has been shared.</p>', 400);
  const code = url.searchParams.get('code');
  if (!code) return html('<p>TikTok did not return an authorisation code.</p>', 400);
  const response = await fetch(TIKTOK_TOKEN_URL, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Cache-Control': 'no-cache' }, body: new URLSearchParams({ client_key: env.TIKTOK_CLIENT_KEY, client_secret: env.TIKTOK_CLIENT_SECRET, code, grant_type: 'authorization_code', redirect_uri: redirectUri(env) }) });
  const tokens = await response.json().catch(() => null);
  if (!response.ok || !tokens || tokens.error) return html('<p>❌ TikTok would not issue an access token for this sign-in attempt.</p>', 502);
  await saveTokens(env, tokens);
  return html('<p>✅ TikTok connected to Live Wire Entertainment.</p><p>Your TikTok access and refresh tokens are stored securely on the server.</p><p><a href="https://livewire2332.github.io/Live-Wire-Entertainment-website/">Return to Live Wire</a></p>');
}

async function creator(request, env) {
  if (!requireMethod(request, 'GET')) return json({ ok: false, error: 'Method not allowed.' }, 405);
  try {
    const token = await accessToken(env);
    const response = await fetch(TIKTOK_CREATOR_INFO_URL, { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json; charset=UTF-8' }, body: '{}' });
    const data = await response.json().catch(() => null);
    if (!response.ok || data?.error?.code !== 'ok') return json({ ok: false, error: data?.error?.message || data?.error?.code || 'Could not load TikTok creator settings.', tiktok_error_code: data?.error?.code || null, tiktok_log_id: data?.error?.log_id || null }, response.status || 502);
    return json({ ok: true, ...data.data });
  } catch (error) { return json({ ok: false, error: error.message }, 401); }
}

async function publish(request, env) {
  if (!requireMethod(request, 'POST')) return json({ ok: false, error: 'Method not allowed.' }, 405);
  try {
    const body = await request.json();
    if (!Number.isFinite(Number(body.video_size)) || Number(body.video_size) <= 0) return json({ ok: false, error: 'A valid video size is required.' }, 400);
    if (Number(body.video_size) > 128 * 1024 * 1024) return json({ ok: false, error: 'Video is larger than 128 MB.' }, 400);
    if (!body.privacy_level) return json({ ok: false, error: 'Choose who can watch the post.' }, 400);
    const token = await accessToken(env);
    const response = await fetch(TIKTOK_PUBLISH_URL, { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json; charset=UTF-8' }, body: JSON.stringify({ post_info: { title: String(body.title || '').slice(0, 2200), privacy_level: body.privacy_level, disable_comment: Boolean(body.disable_comment), disable_duet: Boolean(body.disable_duet), disable_stitch: Boolean(body.disable_stitch), video_cover_timestamp_ms: 1000, brand_content_toggle: Boolean(body.brand_content_toggle), brand_organic_toggle: Boolean(body.brand_organic_toggle) }, source_info: { source: 'FILE_UPLOAD', video_size: Number(body.video_size), chunk_size: Number(body.video_size), total_chunk_count: 1 } }) });
    const data = await response.json().catch(() => null);
    if (!response.ok || data?.error?.code && data.error.code !== 'ok') return json({ ok: false, error: data?.error?.message || data?.error?.code || 'TikTok upload could not be started.', tiktok_error_code: data?.error?.code || null, tiktok_log_id: data?.error?.log_id || null }, response.status >= 400 ? response.status : 502);
    return json({ ok: true, ...data.data });
  } catch (error) { return json({ ok: false, error: error.message }, 400); }
}

function validCasterWebhookAuth(request, env) {
  const header = request.headers.get('Authorization') || '';
  if (!header.startsWith('Basic ')) return false;
  try {
    const decoded = atob(header.slice(6));
    return decoded === 'admin:' + env.CASTER_PRIVATE_TOKEN;
  } catch {
    return false;
  }
}

async function casterWebhook(request, env, online) {
  if (request.method !== 'POST') return json({ ok: false, error: 'Method not allowed.' }, 405);
  if (!env.CASTER_PRIVATE_TOKEN) return json({ ok: false, error: 'Caster private token is not configured.' }, 500);
  if (!validCasterWebhookAuth(request, env)) {
    return new Response(JSON.stringify({ ok: false, error: 'Unauthorized.' }), {
      status: 401,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-store',
        'WWW-Authenticate': 'Basic realm="Live Wire Caster webhook"'
      }
    });
  }

  await request.text().catch(() => '');
  const state = {
    online: Boolean(online),
    updated_at: new Date().toISOString()
  };
  await env.TIKTOK_TOKENS.put('caster_stream_status', JSON.stringify(state));
  return json({ ok: true, ...state });
}

async function casterStreamStatus(request, env) {
  if (request.method !== 'GET') return json({ ok: false, error: 'Method not allowed.' }, 405);
  if (!env.TIKTOK_TOKENS) return json({ ok: false, online: false, error: 'Status storage is not configured.' }, 500);

  try {
    const saved = await env.TIKTOK_TOKENS.get('caster_stream_status', 'json');
    if (!saved) {
      return json({ ok: true, online: false, updated_at: null, source: 'caster-webhook' });
    }
    return json({
      ok: true,
      online: Boolean(saved.online),
      updated_at: saved.updated_at || null,
      source: 'caster-webhook'
    });
  } catch (error) {
    return json({ ok: false, online: false, error: error.message }, 502);
  }
}

async function status(request, env) {
  if (!requireMethod(request, 'POST')) return json({ ok: false, error: 'Method not allowed.' }, 405);
  try {
    const body = await request.json();
    if (!body.publish_id) return json({ ok: false, error: 'publish_id is required.' }, 400);
    const token = await accessToken(env);
    const response = await fetch(TIKTOK_STATUS_URL, { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json; charset=UTF-8' }, body: JSON.stringify({ publish_id: body.publish_id }) });
    const data = await response.json().catch(() => null);
    if (!response.ok || data?.error?.code && data.error.code !== 'ok') return json({ ok: false, error: data?.error?.message || 'Could not check TikTok publishing status.', tiktok_error_code: data?.error?.code || null, tiktok_log_id: data?.error?.log_id || null }, response.status >= 400 ? response.status : 502);
    return json({ ok: true, ...data.data });
  } catch (error) { return json({ ok: false, error: error.message }, 400); }
}

export default {
  async fetch(request, env) {
    if (!env.TIKTOK_CLIENT_KEY || !env.TIKTOK_CLIENT_SECRET || !env.TIKTOK_TOKENS) return json({ ok: false, error: 'TikTok Worker is not configured yet.' }, 500);
    if (request.method === 'OPTIONS') return json({ ok: true });
    const path = new URL(request.url).pathname.replace(/\/$/, '');
    try {
      if (path === '/tiktok-login') return login(request, env);
      if (path === '/tiktok-callback') return callback(request, env);
      if (path === '/tiktok-creator') return creator(request, env);
      if (path === '/tiktok-publish') return publish(request, env);
      if (path === '/tiktok-status') return status(request, env);
      if (path === '/stream-status') return casterStreamStatus(request, env);
      if (path === '/caster-webhook/live') return casterWebhook(request, env, true);
      if (path === '/caster-webhook/off') return casterWebhook(request, env, false);
      return json({ ok: true, service: 'Live Wire Entertainment TikTok Worker' });
    } catch (error) { return json({ ok: false, error: 'Unexpected Worker error.' }, 500); }
  },
};
