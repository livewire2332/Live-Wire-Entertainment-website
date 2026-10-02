# Live Wire Entertainment — ChatGPT Website Editing Setup

## Canonical project
- Official live site: https://livewire2332.github.io/Live-Wire-Entertainment-website/
- GitHub repository: livewire2332/Live-Wire-Entertainment-website
- GitHub Pages is the production site.
- Do NOT switch back to the old Netlify site.

## How ChatGPT should handle website-editing requests
When the user asks to edit, fix, update, add, remove, or check something on the Live Wire website:
1. Treat this repository as the source of truth.
2. Use the connected GitHub tools to inspect the current file(s) before changing them.
3. Make the requested change directly in the repository where appropriate.
4. Preserve existing branding, links, features, and working code unless the user explicitly asks for a change.
5. After editing, report the exact file(s) changed and commit/result.
6. Remind the user that GitHub Pages may take a short time to deploy when relevant.
7. Do not require the user's Mac for normal website edits.

## Current branding / important rules
- Main branding: circular neon Live Wire Entertainment logo.
- Official website URL: https://livewire2332.github.io/Live-Wire-Entertainment-website/
- Linktree: https://linktr.ee/livewireentertainment23
- Live Wire should be treated as the user's main website/HQ project.
- Do not invent show times or shows; use the current project schedule/context.
- Preserve the existing neon Live Wire visual style unless a redesign is requested.

## Current technical notes
- `index.html` and `tiktok-publisher.html` have favicon/apple-touch-icon declarations using `live-wire-logo.jpg`.
- `live-wire-logo.jpg` is the current site logo asset.
- The site also contains the TikTok publisher and Cloudflare/Netlify integration files; edit them only when the request requires it.
- Website schedule changes are part of the connected workflow: HQ/schedule -> website -> social content/automation.

## Cross-chat instruction
A user can say:
"Edit the Live Wire website"
or
"Update Live Wire HQ"
and ChatGPT should use this repository as the canonical project and inspect the current files before editing.

If the GitHub connection is unavailable in a particular chat, do not pretend an edit was made. State that repository access is unavailable in that chat and ask the user to connect/enable GitHub access there.
## Book project
- Live Wire Banter book page: `live-wire-banter.html`
- Homepage includes a compact Live Wire Banter promotion linking to the book page and Amazon.
- Amazon UK book link: https://amzn.eu/d/04ablGbt
- Keep the homepage promotion compact; the dedicated book page is the main sales/promotion page.
