import { getStore } from '@netlify/blobs'

const STORE = 'live-wire-tiktok'
const KEY = 'tokens'
const TOKEN_URL = 'https://open.tiktokapis.com/v2/oauth/token/'
const STATUS_URL = 'https://open.tiktokapis.com/v2/post/publish/status/fetch/'

async function getAccessToken() {
  const store = getStore(STORE)
  const tokens = await store.get(KEY, { type: 'json' })
  if (!tokens?.access_token) throw new Error('Connect TikTok before checking a post.')
  const age = Date.now() - Number(tokens.saved_at || 0)
  const expires = Number(tokens.expires_in || 0) * 1000
  if (expires > 0 && age < expires - 120000) return tokens.access_token
  if (!tokens.refresh_token) throw new Error('TikTok access expired. Please connect TikTok again.')
  const response = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ client_key: Netlify.env.get('TIKTOK_CLIENT_KEY'), client_secret: Netlify.env.get('TIKTOK_CLIENT_SECRET'), grant_type: 'refresh_token', refresh_token: tokens.refresh_token }).toString(),
  })
  const fresh = await response.json().catch(() => null)
  if (!response.ok || !fresh?.access_token) throw new Error('TikTok access expired. Please connect TikTok again.')
  await store.setJSON(KEY, { ...tokens, ...fresh, saved_at: Date.now() })
  return fresh.access_token
}

export default async (req) => {
  if (req.method !== 'POST') return new Response(JSON.stringify({ ok: false, error: 'POST required.' }), { status: 405, headers: { 'Content-Type': 'application/json' } })
  try {
    const { publish_id } = await req.json()
    if (!publish_id) throw new Error('Missing publish ID.')
    const accessToken = await getAccessToken()
    const response = await fetch(STATUS_URL, {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json; charset=UTF-8' },
      body: JSON.stringify({ publish_id }),
    })
    const data = await response.json().catch(() => null)
    if (!response.ok || data?.error?.code) throw new Error(data?.error?.message || 'TikTok status check failed.')
    return new Response(JSON.stringify({ ok: true, ...data.data }), { status: 200, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } })
  } catch (error) {
    return new Response(JSON.stringify({ ok: false, error: error.message }), { status: 400, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } })
  }
}
