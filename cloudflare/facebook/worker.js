const META_GRAPH_VERSION = 'v24.0';
const META_AUTHORIZE_URL = `https://www.facebook.com/${META_GRAPH_VERSION}/dialog/oauth`;
const META_TOKEN_URL = `https://graph.facebook.com/${META_GRAPH_VERSION}/oauth/access_token`;
const META_GRAPH_URL = `https://graph.facebook.com/${META_GRAPH_VERSION}`;
const APP_ID = '1855203898976920';
const ALLOWED_ORIGIN = 'https://livewire2332.github.io';
const TOKEN_KEY = 'facebook_page_connection';

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

function html(body, status = 200) {
  return new Response(`<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Live Wire Facebook Automation</title></head><body style="font-family:system-ui;padding:30px"><h1>⚡ Live Wire Entertainment</h1>${body}<p><a href="${ALLOWED_ORIGIN}/Live-Wire-Entertainment-website/">Back to Live Wire Entertainment</a></p></body></html>`, {
    status,
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' },
  });
}

function redirectUri(request) {
  return new URL('/facebook-callback', request.url).toString();
}

async function login(request, env) {
  const state = crypto.randomUUID();
  await env.FACEBOOK_TOKENS.put(`oauth_state:${state}`, '1', { expirationTtl: 600 });
  const params = new URLSearchParams({
    client_id: APP_ID,
    redirect_uri: redirectUri(request),
    response_type: 'code',
    scope: 'pages_show_list,pages_manage_posts,pages_read_engagement',
    state,
  });
  return new Response(null, { status: 302, headers: { Location: `${META_AUTHORIZE_URL}?${params}`, 'Cache-Control': 'no-store' } });
}

async function callback(request, env) {
  const url = new URL(request.url);
  const state = url.searchParams.get('state');
  if (!state || await env.FACEBOOK_TOKENS.get(`oauth_state:${state}`) !== '1') {
    return html('<p>❌ This Facebook sign-in link could not be verified. Please start again.</p>', 400);
  }
  await env.FACEBOOK_TOKENS.delete(`oauth_state:${state}`);
  if (url.searchParams.get('error')) return html('<p>Facebook did not grant access. Nothing has been changed.</p>', 400);
  const code = url.searchParams.get('code');
  if (!code) return html('<p>Facebook did not return an authorisation code.</p>', 400);

  const tokenUrl = new URL(META_TOKEN_URL);
  tokenUrl.search = new URLSearchParams({
    client_id: APP_ID,
    client_secret: env.FACEBOOK_APP_SECRET,
    redirect_uri: redirectUri(request),
    code,
  }).toString();
  const tokenResponse = await fetch(tokenUrl, { headers: { 'Cache-Control': 'no-cache' } });
  const userToken = await tokenResponse.json().catch(() => null);
  if (!tokenResponse.ok || !userToken?.access_token) {
    return html(`<p>❌ Facebook would not issue an access token.</p><pre>${JSON.stringify(userToken || {}, null, 2)}</pre>`, 502);
  }

  const pagesUrl = new URL(`${META_GRAPH_URL}/me/accounts`);
  pagesUrl.search = new URLSearchParams({
    access_token: userToken.access_token,
    fields: 'id,name,access_token',
  }).toString();
  const pagesResponse = await fetch(pagesUrl);
  const pages = await pagesResponse.json().catch(() => null);
  if (!pagesResponse.ok || !Array.isArray(pages?.data)) {
    return html(`<p>❌ Facebook login worked, but the Page list could not be loaded.</p><pre>${JSON.stringify(pages || {}, null, 2)}</pre>`, 502);
  }

  const page = pages.data.find(p => p.name === 'Live Wire Entertainment') || pages.data[0];
  if (!page?.access_token || !page?.id) {
    return html('<p>❌ No Facebook Page access token was returned for the authorised account.</p>', 403);
  }

  await env.FACEBOOK_TOKENS.put(TOKEN_KEY, JSON.stringify({
    page_id: page.id,
    page_name: page.name,
    page_access_token: page.access_token,
    connected_at: Date.now(),
  }));

  return html(`<p>✅ Facebook connected to <strong>${escapeHtml(page.name)}</strong>.</p><p>The Page connection is stored securely on the Facebook Worker.</p>`);
}

async function connection(env) {
  return await env.FACEBOOK_TOKENS.get(TOKEN_KEY, 'json');
}

async function status(request, env) {
  if (request.method !== 'GET') return json({ ok: false, error: 'Method not allowed.' }, 405);
  const saved = await connection(env);
  return json({ ok: true, connected: Boolean(saved?.page_access_token), page_id: saved?.page_id || null, page_name: saved?.page_name || null });
}

async function publish(request, env) {
  if (request.method !== 'POST') return json({ ok: false, error: 'Method not allowed.' }, 405);
  const saved = await connection(env);
  if (!saved?.page_access_token || !saved?.page_id) return json({ ok: false, error: 'Facebook Page is not connected yet.' }, 401);
  const body = await request.json().catch(() => null);
  const message = String(body?.message || '').trim();
  if (!message) return json({ ok: false, error: 'A post message is required.' }, 400);

  const publishUrl = new URL(`${META_GRAPH_URL}/${saved.page_id}/feed`);
  const response = await fetch(publishUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ message, access_token: saved.page_access_token }),
  });
  const result = await response.json().catch(() => null);
  if (!response.ok || result?.error) return json({ ok: false, error: result?.error?.message || 'Facebook post failed.', facebook_error: result?.error || null }, response.status >= 400 ? response.status : 502);
  return json({ ok: true, post_id: result?.id || null });
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[c]));
}

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') return json({ ok: true });
    if (!env.FACEBOOK_APP_SECRET || !env.FACEBOOK_TOKENS) return json({ ok: false, error: 'Facebook Worker is not configured yet.' }, 500);
    const path = new URL(request.url).pathname.replace(/\/$/, '');
    try {
      if (path === '/facebook-login') return login(request, env);
      if (path === '/facebook-callback') return callback(request, env);
      if (path === '/facebook-status') return status(request, env);
      if (path === '/facebook-publish') return publish(request, env);
      return json({ ok: true, service: 'Live Wire Entertainment Facebook Worker' });
    } catch (error) {
      return json({ ok: false, error: 'Unexpected Facebook Worker error.' }, 500);
    }
  },
};
