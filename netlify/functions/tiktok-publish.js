import { getStore } from '@netlify/blobs'

const STORE = 'live-wire-tiktok'
const KEY = 'tokens'
const TOKEN_URL = 'https://open.tiktokapis.com/v2/oauth/token/'
const PUBLISH_URL = 'https://open.tiktokapis.com/v2/post/publish/video/init/'

async function getAccessToken() {
  const store = getStore(STORE)
  const tokens = await store.get(KEY, { type: 'json' })
  if (!tokens?.access_token) throw new Error('Connect TikTok before publishing.')
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
  await store.setJSON(KEY, { ...tokens, ...fresh, saved_at: Date.now() })
  return fresh.access_token
}

export default async (req) => {
  if (req.method !== 'POST') return new Response(JSON.stringify({ ok: false, error: 'POST required.' }), { status: 405, headers: { 'Content-Type': 'application/json' } })
  try {
    const input = await req.json()
    const size = Number(input.video_size)
    const title = String(input.title || '').trim().slice(0, 2200)
    const privacy = String(input.privacy_level || '').trim()
    const allowed = ['PUBLIC_TO_EVERYONE', 'MUTUAL_FOLLOW_FRIENDS', 'SELF_ONLY']
    if (!Number.isInteger(size) || size < 1) throw new Error('Choose a video file first.')
    if (!allowed.includes(privacy)) throw new Error('Choose a valid TikTok privacy setting.')

    const accessToken = await getAccessToken()
    const response = await fetch(PUBLISH_URL, {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json; charset=UTF-8' },
      body: JSON.stringify({
        post_info: {
          title,
          privacy_level: privacy,
          disable_duet: Boolean(input.disable_duet),
          disable_comment: Boolean(input.disable_comment),
          disable_stitch: Boolean(input.disable_stitch),
        },
        source_info: {
          source: 'FILE_UPLOAD',
          video_size: size,
          chunk_size: size,
          total_chunk_count: 1,
        },
      }),
    })
    const data = await response.json().catch(() => null)
    if (!response.ok || data?.error?.code) throw new Error(data?.error?.message || 'TikTok could not initialise the upload.')

    return new Response(JSON.stringify({ ok: true, publish_id: data.data.publish_id, upload_url: data.data.upload_url }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ ok: false, error: error.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
    })
  }
}
