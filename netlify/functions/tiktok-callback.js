// Step 2 of TikTok Login Kit (v2): TikTok redirects the visitor back here with a
// one-time authorisation code, which is exchanged server-side for tokens.
// Reached at /.netlify/functions/tiktok-callback
//
// Required environment variables (set them in Netlify, never in the repo):
//   TIKTOK_CLIENT_KEY
//   TIKTOK_CLIENT_SECRET
// Optional:
//   TIKTOK_REDIRECT_URI - must be identical to the value used by tiktok-login
//                         and to the redirect URI registered with TikTok.

const TIKTOK_TOKEN_URL = 'https://open.tiktokapis.com/v2/oauth/token/'
const STATE_COOKIE = 'tiktok_oauth_state'

function callbackUrl(req) {
  const configured = Netlify.env.get('TIKTOK_REDIRECT_URI')
  if (configured) return configured.trim()

  return new URL('/.netlify/functions/tiktok-callback', req.url).toString()
}

function escapeHtml(value) {
  return String(value).replace(
    /[&<>"']/g,
    (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char],
  )
}

function page({ title, heading, body, status }) {
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapeHtml(title)} | Live Wire Entertainment</title>
<link rel="stylesheet" href="/style.css"></head><body>
<section><div class="wrap"><h1>${escapeHtml(heading)}</h1>
${body}
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
    body: `<div class="card"><p>${escapeHtml(message)}</p></div>
<p>You can <a href="/.netlify/functions/tiktok-login">try signing in again</a>.</p>`,
    status,
  })
}

async function exchangeCodeForTokens({ code, clientKey, clientSecret, redirectUri }) {
  const response = await fetch(TIKTOK_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cache-Control': 'no-cache',
    },
    body: new URLSearchParams({
      client_key: clientKey,
      client_secret: clientSecret,
      code,
      grant_type: 'authorization_code',
      redirect_uri: redirectUri,
    }).toString(),
  })

  let payload
  try {
    payload = await response.json()
  } catch {
    throw new Error('TikTok returned an unreadable response while exchanging the authorisation code.')
  }

  // TikTok can answer 200 with an error field, so both are checked.
  if (!response.ok || payload.error) {
    // Logged for the site owner. Codes and descriptions only, never credentials.
    console.error('tiktok-callback: token exchange rejected', {
      httpStatus: response.status,
      error: payload.error,
      errorDescription: payload.error_description,
      logId: payload.log_id,
    })
    throw new Error('TikTok would not issue an access token for this sign-in attempt.')
  }

  return payload
}

export default async (req, context) => {
  const clientKey = Netlify.env.get('TIKTOK_CLIENT_KEY')
  const clientSecret = Netlify.env.get('TIKTOK_CLIENT_SECRET')

  if (!clientKey || !clientSecret) {
    console.error('tiktok-callback: TIKTOK_CLIENT_KEY and/or TIKTOK_CLIENT_SECRET are not configured')
    return failure('TikTok sign-in is not configured for this site yet. Please try again later.', 500)
  }

  const params = new URL(req.url).searchParams
  const expectedState = context.cookies.get(STATE_COOKIE)

  // The single-use state cookie is cleared however this request turns out.
  context.cookies.delete({ name: STATE_COOKIE, path: '/' })

  // TikTok reports a declined or failed authorisation on the query string.
  const tiktokError = params.get('error') || params.get('errCode')
  if (tiktokError) {
    console.warn('tiktok-callback: authorisation not granted', {
      error: tiktokError,
      errorDescription: params.get('error_description'),
    })
    return failure('TikTok did not grant access. If you cancelled the sign-in, nothing has been shared.', 400)
  }

  const state = params.get('state')
  if (!expectedState || !state || state !== expectedState) {
    console.warn('tiktok-callback: state mismatch, possible CSRF or an expired sign-in attempt')
    return failure('This sign-in link has expired or could not be verified. Please start again.', 400)
  }

  const code = params.get('code')
  if (!code) {
    return failure('TikTok did not return an authorisation code. Please start again.', 400)
  }

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

  // Non-sensitive confirmation only. Tokens are never logged or sent to the browser.
  console.log('tiktok-callback: token exchange succeeded', {
    scopesGranted: tokens.scope,
    accessTokenExpiresIn: tokens.expires_in,
    refreshTokenExpiresIn: tokens.refresh_expires_in,
  })

  const grantedScopes = tokens.scope ? escapeHtml(tokens.scope) : 'none reported'
  const validForMinutes = Number.isFinite(Number(tokens.expires_in))
    ? Math.round(Number(tokens.expires_in) / 60)
    : null

  return page({
    title: 'TikTok connected',
    heading: '⚡ TikTok connected',
    body: `<div class="card">
<p>Your TikTok account has been connected to Live Wire Entertainment.</p>
<p>Permissions granted: <strong>${grantedScopes}</strong></p>
${validForMinutes ? `<p>This session's access is valid for about ${validForMinutes} minutes.</p>` : ''}
<p>For your security, the access and refresh tokens stay on the server and are never shown here.</p>
</div>`,
    status: 200,
  })
}
