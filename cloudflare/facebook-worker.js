const FACEBOOK_GRAPH_VERSION = 'v26.0';
const FACEBOOK_AUTHORIZE_URL = `https://www.facebook.com/${FACEBOOK_GRAPH_VERSION}/dialog/oauth`;
const FACEBOOK_TOKEN_URL = `https://graph.facebook.com/${FACEBOOK_GRAPH_VERSION}/oauth/access_token`;
const FACEBOOK_ME_ACCOUNTS_URL = `https://graph.facebook.com/${FACEBOOK_GRAPH_VERSION}/me/accounts`;
const TOKEN_KEY = 'facebook_tokens';
const STATE_PREFIX = 'facebook_oauth_state:';
const FACEBOOK_REDIRECT_URI = 'https://live-wire-facebook-automation.dlyons184.workers.dev/facebook-callback';

function json(data, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-Publish-Secret',
    },
  });
}

function html(body, status = 200) {
  return new Response(`<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Live Wire Facebook Automation</title></head><body style="font-family:system-ui;padding:30px;max-width:760px;margin:auto"><h1>⚡ Live Wire Entertainment</h1>${body}</body></html>`, {
    status,
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' },
  });
}

function redirectUri() {
  return FACEBOOK_REDIRECT_URI;
}

function requireConfigured(env) {
  const missing = ['FACEBOOK_KV','PUBLISH_SECRET'].filter((key) => !env[key]);
  if (missing.length) throw new Error(`Missing Facebook Worker configuration: ${missing.join(', ')}`);
}

function requireOAuthConfigured(env) {
  const missing = ['FACEBOOK_APP_ID','FACEBOOK_APP_SECRET','FACEBOOK_CONFIG_ID'].filter((key) => !env[key]);
  if (missing.length) throw new Error(`Missing Facebook OAuth configuration: ${missing.join(', ')}`);
}

async function login(request, env) {
  requireOAuthConfigured(env);
  const state = crypto.randomUUID();
  await env.FACEBOOK_KV.put(`${STATE_PREFIX}${state}`, '1', { expirationTtl: 600 });
  const params = new URLSearchParams({
    client_id: env.FACEBOOK_APP_ID,
    config_id: env.FACEBOOK_CONFIG_ID,
    redirect_uri: redirectUri(),
    response_type: 'code',
    state,
  });
  return new Response(null, { status: 302, headers: { Location: `${FACEBOOK_AUTHORIZE_URL}?${params}`, 'Cache-Control': 'no-store' } });
}

async function callback(request, env) {
  requireOAuthConfigured(env);
  const url = new URL(request.url);
  const state = url.searchParams.get('state');
  if (!state) return html('<p>❌ Missing OAuth state. Please start the Facebook connection again.</p>', 400);
  const stateKey = `${STATE_PREFIX}${state}`;
  const validState = await env.FACEBOOK_KV.get(stateKey);
  if (validState !== '1') return html('<p>❌ This Facebook sign-in link could not be verified. Please start again.</p>', 400);
  await env.FACEBOOK_KV.delete(stateKey);
  const error = url.searchParams.get('error');
  if (error) return html(`<p>❌ ${escapeHtml(url.searchParams.get('error_description') || 'Facebook did not grant access.')}</p>`, 400);
  const code = url.searchParams.get('code');
  if (!code) return html('<p>❌ Facebook did not return an authorisation code.</p>', 400);

  const tokenUrl = new URL(FACEBOOK_TOKEN_URL);
  tokenUrl.search = new URLSearchParams({
    client_id: env.FACEBOOK_APP_ID,
    client_secret: env.FACEBOOK_APP_SECRET,
    redirect_uri: redirectUri(env),
    code,
  }).toString();

  const tokenResponse = await fetch(tokenUrl, { headers: { 'Cache-Control': 'no-cache' } });
  const tokenData = await tokenResponse.json().catch(() => null);
  if (!tokenResponse.ok || !tokenData?.access_token) {
    return html(`<p>❌ Facebook would not issue an access token.</p><pre>${escapeHtml(JSON.stringify(tokenData || {}, null, 2))}</pre>`, 502);
  }

  const accountsUrl = new URL(FACEBOOK_ME_ACCOUNTS_URL);
  accountsUrl.search = new URLSearchParams({
    fields: 'id,name,access_token,tasks',
    access_token: tokenData.access_token,
  }).toString();

  const accountsResponse = await fetch(accountsUrl);
  const accountsData = await accountsResponse.json().catch(() => null);
  if (!accountsResponse.ok || !Array.isArray(accountsData?.data)) {
    return html(`<p>❌ Facebook login succeeded, but the Page could not be retrieved.</p><pre>${escapeHtml(JSON.stringify(accountsData || {}, null, 2))}</pre>`, 502);
  }

  const page = accountsData.data.find((item) => item?.id === '1309243555604210') || accountsData.data[0];
  if (!page?.id || !page?.access_token) return html('<p>❌ Facebook login succeeded, but no accessible Page was returned.</p>', 403);

  await env.FACEBOOK_KV.put(TOKEN_KEY, JSON.stringify({
    page_id: page.id,
    page_name: page.name || null,
    page_access_token: page.access_token,
    user_access_token: tokenData.access_token,
    scope: tokenData.scope || null,
    saved_at: Date.now(),
  }));

  return html(`<p>✅ Facebook is connected to Live Wire Entertainment.</p><p>Page: <strong>${escapeHtml(page.name || page.id)}</strong></p><p>The access credentials are stored securely in Cloudflare KV.</p>`);
}

async function status(env) {
  const stored = await env.FACEBOOK_KV.get(TOKEN_KEY, 'json');
  if (!stored?.page_access_token) return json({ ok: true, connected: false });
  return json({ ok: true, connected: true, page_id: stored.page_id, page_name: stored.page_name, saved_at: stored.saved_at });
}

async function pageInfo(env) {
  const stored = await env.FACEBOOK_KV.get(TOKEN_KEY, 'json');
  if (!stored?.page_access_token) return json({ ok: false, error: 'Facebook Page is not connected yet.' }, 401);
  const url = new URL(`https://graph.facebook.com/${FACEBOOK_GRAPH_VERSION}/${stored.page_id}`);
  url.search = new URLSearchParams({ fields: 'id,name', access_token: stored.page_access_token }).toString();
  const response = await fetch(url);
  const data = await response.json().catch(() => null);
  if (!response.ok) return json({ ok: false, error: data?.error?.message || 'Could not read the Facebook Page.' }, response.status || 502);
  return json({ ok: true, ...data });
}

async function publish(request, env) {
  const suppliedSecret = request.headers.get('X-Publish-Secret');
  if (!suppliedSecret || suppliedSecret !== env.PUBLISH_SECRET) return json({ ok: false, error: 'Unauthorised.' }, 401);

  let body;
  try { body = await request.json(); }
  catch { return json({ ok: false, error: 'Request body must be valid JSON.' }, 400); }

  const message = typeof body?.message === 'string' ? body.message.trim() : '';
  if (!message) return json({ ok: false, error: 'A non-empty "message" is required.' }, 400);
  if (message.length > 63206) return json({ ok: false, error: 'Facebook post is too long.' }, 400);

  const stored = await env.FACEBOOK_KV.get(TOKEN_KEY, 'json');
  if (!stored?.page_id || !stored?.page_access_token) {
    return json({ ok: false, error: 'Facebook Page is not connected in Cloudflare KV.' }, 401);
  }

  const publishUrl = new URL(`https://graph.facebook.com/${FACEBOOK_GRAPH_VERSION}/${stored.page_id}/feed`);
  const publishBody = new URLSearchParams({ message, access_token: stored.page_access_token });

  const response = await fetch(publishUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: publishBody,
  });

  const data = await response.json().catch(() => null);
  if (!response.ok || data?.error) {
    return json({
      ok: false,
      error: data?.error?.message || 'Facebook rejected the post.',
      meta_error: data?.error || null,
    }, response.status || 502);
  }

  return json({ ok: true, published: true, page_id: stored.page_id, post_id: data?.id || null });
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[char]));
}

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') return json({ ok: true });
    try {
      requireConfigured(env);
      const url = new URL(request.url);
      const path = url.pathname.replace(/\/$/, '');
      if (path === '/facebook-login') return login(request, env);
      if (path === '/facebook-callback') return callback(request, env);
      if (path === '/facebook-status') return status(env);
      if (path === '/facebook-page') return pageInfo(env);
      if (path === '/publish' && request.method === 'POST') return publish(request, env);
      return json({ ok: true, service: 'Live Wire Entertainment Facebook Worker' });
    } catch (error) {
      return json({ ok: false, error: error.message || 'Unexpected Worker error.' }, 500);
    }
  },
};