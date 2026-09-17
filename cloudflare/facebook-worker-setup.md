# Live Wire Facebook Automation Worker

This is intentionally separate from `cloudflare/tiktok-worker.js` and the existing `live-wire-entertainment-website` Worker.

## Worker name

`live-wire-facebook-automation`

## Script

Use `cloudflare/facebook-worker.js`.

## Required Cloudflare KV binding

Create a new KV namespace dedicated to this Worker and bind it as:

`FACEBOOK_KV`

Do not reuse the TikTok KV namespace.

## Required Worker secrets/variables

Set these in the new Worker only:

- `FACEBOOK_APP_ID` = `1855203898976920`
- `FACEBOOK_CONFIG_ID` = `1095870756233272`
- `FACEBOOK_REDIRECT_URI` = `https://<NEW-WORKER-SUBDOMAIN>.workers.dev/facebook-callback`
- `FACEBOOK_APP_SECRET` = the Meta App Secret (Cloudflare Secret; never put it in GitHub)

The worker deliberately does not put Facebook permissions into the OAuth URL. The Facebook Login for Business configuration supplies the configured permissions.

## Meta redirect URI

After the Worker has its final `workers.dev` hostname, add the exact `/facebook-callback` URL to Meta's Facebook Login for Business valid OAuth redirect URIs.

## First test

Open:

`https://<NEW-WORKER-SUBDOMAIN>.workers.dev/facebook-login`

Complete the Facebook authorisation. Then test:

`https://<NEW-WORKER-SUBDOMAIN>.workers.dev/facebook-status`

A successful connection returns `connected: true` and the authorised Page ID/name, without exposing the stored access token.
