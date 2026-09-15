// Step 1 of TikTok Login Kit (v2): send the visitor to TikTok to authorise the app.
// Reached at /.netlify/functions/tiktok-login
//
// Required environment variables (set them in Netlify, never in the repo):
//   TIKTOK_CLIENT_KEY    - the app's Client Key from the TikTok developer portal
//   TIKTOK_CLIENT_SECRET - used by tiktok-callback, not here
// Optional:
//   TIKTOK_REDIRECT_URI  - overrides the derived callback URL. Must match the
//                          "Redirect URI" registered for the app on TikTok.
//   TIKTOK_SCOPES        - space separated scopes, defaults to user.info.basic

const TIKTOK_AUTHORIZE_URL = 'https://www.tiktok.com/v2/auth/authorize/'
const DEFAULT_SCOPES = 'user.info.basic'
const STATE_COOKIE = 'tiktok_oauth_state'
const STATE_MAX_AGE_SECONDS = 600

function callbackUrl(req) {
  const configured = Netlify.env.get('TIKTOK_REDIRECT_URI')
  if (configured) return configured.trim()

  // Same-origin default so deploy previews and production each work unchanged.
  return new URL('/.netlify/functions/tiktok-callback', req.url).toString()
}

function randomState() {
  const bytes = new Uint8Array(24)
  crypto.getRandomValues(bytes)
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')
}

function errorPage(message, status) {
  const body = `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>TikTok sign-in unavailable | Live Wire Entertainment</title>
<link rel="stylesheet" href="/style.css"></head><body>
<section><div class="wrap"><h1>TikTok sign-in unavailable</h1>
<p>${message}</p>
<p><a href="/">&larr; Back to Live Wire Entertainment</a></p></div></section></body></html>`

  return new Response(body, {
    status,
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' },
  })
}

export default async (req, context) => {
  const clientKey = Netlify.env.get('TIKTOK_CLIENT_KEY')

  if (!clientKey) {
    console.error('tiktok-login: TIKTOK_CLIENT_KEY is not configured')
    return errorPage('TikTok sign-in is not configured for this site yet. Please try again later.', 500)
  }

  const state = randomState()

  // The state is kept in an httpOnly cookie and compared on the way back, which
  // stops a third party from replaying an authorisation code at our callback.
  // SameSite=Lax still sends it on TikTok's top-level redirect back to us.
  context.cookies.set({
    name: STATE_COOKIE,
    value: state,
    path: '/',
    httpOnly: true,
    secure: true,
    sameSite: 'Lax',
    maxAge: STATE_MAX_AGE_SECONDS,
  })

  const authorizeUrl = new URL(TIKTOK_AUTHORIZE_URL)
  authorizeUrl.searchParams.set('client_key', clientKey)
  authorizeUrl.searchParams.set('scope', Netlify.env.get('TIKTOK_SCOPES') || DEFAULT_SCOPES)
  authorizeUrl.searchParams.set('response_type', 'code')
  authorizeUrl.searchParams.set('redirect_uri', callbackUrl(req))
  authorizeUrl.searchParams.set('state', state)

  return new Response(null, {
    status: 302,
    headers: { Location: authorizeUrl.toString(), 'Cache-Control': 'no-store' },
  })
}
