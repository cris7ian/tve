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

echo "Verification complete."
