import { getStore } from '@netlify/blobs'

const TIKTOK_TOKEN_URL = 'https://open.tiktokapis.com/v2/oauth/token/'
const STATE_COOKIE = 'tiktok_oauth_state'
const TOKEN_STORE = 'live-wire-tiktok'
const TOKEN_KEY = 'tokens'

function callbackUrl(req) {
  const configured = Netlify.env.get('TIKTOK_REDIRECT_URI')
  if (configured) return configured.trim()
  return new URL('/.netlify/functions/tiktok-callback', req.url).toString()
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[char])
}

function page({ title, heading, body, status }) {
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapeHtml(title)} | Live Wire Entertainment</title>
<link rel="stylesheet" href="/style.css"></head><body>
<section><div class="wrap"><h1>${escapeHtml(heading)}</h1>${body}
<p><a class="btn" href="/">&larr; Back to Live Wire Entertainment</a></p></div></section></body></html>`
  return new Response(html, {
    status,
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' },
  })
}

function failure(message, status) {
  return page({
    title: 'TikTok sign-in failed',
    heading: 'TikTok sign-in failed',
    body: `<div class="card"><p>${escapeHtml(message)}</p></div><p><a href="/.netlify/functions/tiktok-login">try signing in again</a>.</p>`,
    status,
  })
}

async function exchangeCodeForTokens({ code, clientKey, clientSecret, redirectUri }) {
  const response = await fetch(TIKTOK_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Cache-Control': 'no-cache' },
    body: new URLSearchParams({
      client_key: clientKey,
      client_secret: clientSecret,
      code,
      grant_type: 'authorization_code',
      redirect_uri: redirectUri,
    }).toString(),
  })

  const payload = await response.json().catch(() => null)
  if (!response.ok || !payload || payload.error) {
    console.error('tiktok-callback: token exchange rejected', {
      httpStatus: response.status,
      error: payload?.error,
      errorDescription: payload?.error_description,
      logId: payload?.log_id,
    })
    throw new Error('TikTok would not issue an access token for this sign-in attempt.')
  }
  return payload
}

export default async (req, context) => {
  const clientKey = Netlify.env.get('TIKTOK_CLIENT_KEY')
  const clientSecret = Netlify.env.get('TIKTOK_CLIENT_SECRET')
  if (!clientKey || !clientSecret) {
    return failure('TikTok sign-in is not configured for this site yet. Please try again later.', 500)
  }

  const params = new URL(req.url).searchParams
  const expectedState = context.cookies.get(STATE_COOKIE)
  context.cookies.delete({ name: STATE_COOKIE, path: '/' })

  const tiktokError = params.get('error') || params.get('errCode')
  if (tiktokError) return failure('TikTok did not grant access. If you cancelled the sign-in, nothing has been shared.', 400)

  const state = params.get('state')
  if (!expectedState || !state || state !== expectedState) {
    return failure('This sign-in link has expired or could not be verified. Please start again.', 400)
  }

  const code = params.get('code')
  if (!code) return failure('TikTok did not return an authorisation code. Please start again.', 400)

  let tokens
  try {
    tokens = await exchangeCodeForTokens({
      code,
      clientKey,
      clientSecret,
      redirectUri: callbackUrl(req),
    })
  } catch (error) {
    return failure(error.message, 502)
  }

  try {
    const store = getStore(TOKEN_STORE)
    await store.setJSON(TOKEN_KEY, {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_in: Number(tokens.expires_in || 0),
      refresh_expires_in: Number(tokens.refresh_expires_in || 0),
      open_id: tokens.open_id || null,
      scope: tokens.scope || '',
      saved_at: Date.now(),
    })
  } catch (error) {
    console.error('tiktok-callback: token storage failed', error)
    return failure('TikTok connected, but the secure server storage step failed. Please try again.', 500)
  }

  const grantedScopes = tokens.scope ? escapeHtml(tokens.scope) : 'none reported'
  const validForMinutes = Number.isFinite(Number(tokens.expires_in)) ? Math.round(Number(tokens.expires_in) / 60) : null

  return page({
    title: 'TikTok connected',
    heading: '⚡ TikTok connected',
    body: `<div class="card"><p>Your TikTok account has been connected to Live Wire Entertainment.</p>
<p>Permissions granted: <strong>${grantedScopes}</strong></p>
${validForMinutes ? `<p>This session's access is valid for about ${validForMinutes} minutes.</p>` : ''}
<p>For your security, the access and refresh tokens are stored securely on the server and are never shown here.</p>
</div><p><a class="btn" href="/">Open the TikTok Publisher</a></p>`,
    status: 200,
  })
}
