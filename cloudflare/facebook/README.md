# Live Wire Facebook Automation Worker

This is intentionally isolated from the existing TikTok Worker.

Cloudflare must deploy from this directory using:

`cd cloudflare/facebook && npx wrangler deploy`

Do not use the existing `cloudflare/wrangler.jsonc`; that configuration belongs to TikTok.

Required Cloudflare resources:
- Secret: `FACEBOOK_APP_SECRET`
- KV binding: `FACEBOOK_TOKENS`

Facebook Login for Business configuration:
- App ID: `1855203898976920`
- Configuration ID: `1095870756233272`
- Callback path: `/facebook-callback`

Worker endpoints:
- `/facebook-login` — starts Facebook authorization
- `/facebook-callback` — receives the OAuth callback and stores the Page connection
- `/facebook-status` — checks connection status
- `/facebook-publish` — publishes a text post to the connected Page

The existing TikTok Worker and website files are not changed by this worker configuration.
