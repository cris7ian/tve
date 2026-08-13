# TVE en directo

An installable web app that plays the RTVE Noticias Canal 24 Horas live stream.
It is designed to open from an Android home-screen icon.

## Purpose

This app was made for a hospitalized 90-year-old family member who cannot
comfortably use a phone. It reduces the experience to one installed icon that
opens live TV.

Keep that accessibility goal central to future changes. The app should remain
simple, reliable, and usable without navigation, account setup, or unfamiliar
video controls.

## Requirements

- Node.js 22.13.0 or later.
- npm.

## Development

Install dependencies and start the local server:

```sh
npm ci
npm run dev
```

## Commands

```sh
npm run dev           # Local Vinext and Cloudflare server.
npm run build         # Cloudflare worker build.
npm run build:static  # Static export in dist/client.
npm test              # Build and test rendered HTML.
npm run lint          # Run ESLint.
./scripts/verify.sh   # Run tests and validate the static export.
```

## Deployment

`scripts/deploy_web.sh` runs verification, publishes `dist/client` to the S3
bucket `tv.cristiancaroli.com`, and invalidates CloudFront.

To deploy from a local machine, configure AWS credentials. The script uses the
`personal` profile when `AWS_ACCESS_KEY_ID` is not set. Use `AWS_PROFILE` or
`DISTRIBUTION_ID` to override these values.

```sh
./scripts/deploy_web.sh
```

Each push to `main` runs `.github/workflows/deploy.yml`. The workflow uses
encrypted GitHub secrets for a dedicated AWS user. Its policy only permits
publishing this bucket and invalidating this CloudFront distribution. The
repository contains no AWS keys.

## Install on Android

1. Open [TVE en directo](https://tv.cristiancaroli.com) in Chrome.
2. Open the Chrome menu.
3. Tap **Add to Home screen** or **Install app**.
4. Confirm the name **TVE Directo**.
5. Open the icon and check the audio.

If Chrome blocks autoplay, tap the play button that appears over the video.
