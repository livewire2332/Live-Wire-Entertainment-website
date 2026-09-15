import { getStore } from '@netlify/blobs'

const STORE = 'live-wire-tiktok'
const KEY = 'tokens'
const TOKEN_URL = 'https://open.tiktokapis.com/v2/oauth/token/'
const CREATOR_URL = 'https://open.tiktokapis.com/v2/post/publish/creator_info/query/'

async function getAccessToken() {
  const store = getStore(STORE)
  const tokens = await store.get(KEY, { type: 'json' })
  if (!tokens?.access_token) throw new Error('TikTok is not connected yet.')

  const age = Date.now() - Number(tokens.saved_at || 0)
  const expires = Number(tokens.expires_in || 0) * 1000
  if (expires > 0 && age < expires - 120000) return tokens.access_token
  if (!tokens.refresh_token) throw new Error('TikTok access expired. Please connect TikTok again.')

  const response = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_key: Netlify.env.get('TIKTOK_CLIENT_KEY'),
      client_secret: Netlify.env.get('TIKTOK_CLIENT_SECRET'),
      grant_type: 'refresh_token',
      refresh_token: tokens.refresh_token,
    }).toString(),
  })
  const fresh = await response.json().catch(() => null)
  if (!response.ok || !fresh?.access_token) throw new Error('TikTok access expired. Please connect TikTok again.')

  await store.setJSON(KEY, {
    ...tokens,
    ...fresh,
    saved_at: Date.now(),
  })
  return fresh.access_token
}

export default async () => {
  try {
    const accessToken = await getAccessToken()
    const response = await fetch(CREATOR_URL, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    const data = await response.json().catch(() => null)
    if (!response.ok || data?.error?.code) throw new Error(data?.error?.message || 'TikTok creator settings could not be loaded.')

    return new Response(JSON.stringify({ ok: true, ...data.data }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ ok: false, error: error.message }), {
      status: 401,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
    })
  }
}
