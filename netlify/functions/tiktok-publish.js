import { getStore } from '@netlify/blobs'

const STORE = 'live-wire-tiktok'
const KEY = 'tokens'
const TOKEN_URL = 'https://open.tiktokapis.com/v2/oauth/token/'
const CREATOR_URL = 'https://open.tiktokapis.com/v2/post/publish/creator_info/query/'
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

async function getCreatorInfo(accessToken) {
  const response = await fetch(CREATOR_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify({}),
  })
  const data = await response.json().catch(() => null)
  if (!response.ok || (data?.error?.code && data.error.code !== 'ok')) {
    throw new Error(data?.error?.message || 'TikTok creator settings could not be loaded.')
  }
  return data.data || {}
}

export default async (req) => {
  if (req.method !== 'POST') return new Response(JSON.stringify({ ok: false, error: 'POST required.' }), { status: 405, headers: { 'Content-Type': 'application/json' } })
  try {
    const input = await req.json()
    const size = Number(input.video_size)
    const duration = Number(input.video_duration)
    const title = String(input.title || '').trim().slice(0, 2200)
    const privacy = String(input.privacy_level || '').trim()
    const commercial = Boolean(input.commercial_content)
    const brandOrganic = Boolean(input.brand_organic_toggle)
    const brandContent = Boolean(input.brand_content_toggle)

    if (!Number.isInteger(size) || size < 1) throw new Error('Choose a video file first.')
    if (size > 128 * 1024 * 1024) throw new Error('For this test, please use a video no larger than 128 MB.')
    if (!privacy) throw new Error('Choose a TikTok privacy setting.')
    if (commercial && !brandOrganic && !brandContent) throw new Error('Choose whether the commercial content promotes your brand, another brand, or both.')
    if (brandContent && privacy === 'SELF_ONLY') throw new Error('Branded content cannot be posted with private visibility.')

    const accessToken = await getAccessToken()
    const creator = await getCreatorInfo(accessToken)
    const options = Array.isArray(creator.privacy_level_options) ? creator.privacy_level_options : []
    if (!options.includes(privacy)) throw new Error('That privacy setting is no longer available for this TikTok account. Reload TikTok settings and choose again.')
    if (Number.isFinite(duration) && creator.max_video_post_duration_sec && duration > Number(creator.max_video_post_duration_sec)) {
      throw new Error(`This video is ${Math.round(duration)} seconds long, but TikTok currently allows up to ${creator.max_video_post_duration_sec} seconds for this account.`)
    }
    if (creator.can_post === false || creator.post_disabled === true) throw new Error('TikTok is not allowing this account to post right now. Please try again later.')

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
          brand_content_toggle: brandContent,
          brand_organic_toggle: brandOrganic,
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
