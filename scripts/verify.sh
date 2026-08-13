#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

cd "$ROOT_DIR"
npm test
npm run build:static

test -f dist/client/index.html
test -f dist/client/manifest.webmanifest
test -f dist/client/icon-192.png
test -f dist/client/icon-512.png

grep -q 'youtube-nocookie.com/embed/b4tE5aKhtlg' dist/client/index.html
grep -q '"display": "standalone"' dist/client/manifest.webmanifest
grep -q '"id": "/"' dist/client/manifest.webmanifest
grep -q 'apple-mobile-web-app-capable' dist/client/index.html

if grep -Eq '<form\b' dist/client/index.html; then
  echo "Unexpected form found in the full-screen player."
  exit 1
fi

test "$(grep -Eo '<button\b' dist/client/index.html | wc -l | tr -d ' ')" = "1"
grep -q 'aria-label="Reproducir TVE"' dist/client/index.html

echo "Verification complete."
