# CLAUDE.md

## Project overview

TVE en directo is a Spanish progressive web app (PWA) for the RTVE Canal 24
Horas live stream. It uses React, Vinext, and Vite. Production is a static
export served from Amazon S3 through CloudFront.

## Commands

- Install dependencies: `npm ci`
- Start local development: `npm run dev`
- Build the Cloudflare worker target: `npm run build`
- Build the static production target: `npm run build:static`
- Run rendered HTML tests: `npm test`
- Run lint: `npm run lint`
- Run the full static verification: `./scripts/verify.sh`
- Deploy production: `./scripts/deploy_web.sh`

Use Node.js 22.13.0 or later.

## Architecture

- `app/page.tsx` contains the single live-stream screen. It embeds the
  privacy-enhanced YouTube player URL for Canal 24 Horas.
- `app/layout.tsx` defines the Spanish metadata, PWA manifest, and production
  URL.
- `next.config.ts` creates the static export only when `TVE_STATIC_EXPORT=1`.
- `worker/index.ts` supports the Vinext Cloudflare worker build. The production
  deployment uses the static export in `dist/client`.
- `scripts/verify.sh` is the release gate. It tests rendered HTML and checks
  the static PWA files and stream URL.

## Conventions and constraints

- Keep the interface in Spanish.
- Preserve the `youtube-nocookie.com` embed host. The rendered-HTML test
  rejects links to the normal YouTube watch page.
- Keep the embedded player full-screen and non-interactive. The only app
  control is a large play button that prevents taps from reaching YouTube.
- Attempt autoplay when the app opens. Pause the player whenever the app
  becomes hidden or closes, then reload it when it returns to the foreground.
- Run `./scripts/verify.sh` before a production deployment.
- Do not store AWS credentials in this repository. Local deploys use ambient
  credentials or the `personal` AWS profile. GitHub Actions uses encrypted
  repository secrets for a dedicated, least-privilege AWS user.
