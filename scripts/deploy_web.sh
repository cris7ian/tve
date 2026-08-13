#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BUCKET="tv.cristiancaroli.com"
DOMAIN="tv.cristiancaroli.com"
AWS_ARGS=()

if [[ -z "${AWS_ACCESS_KEY_ID:-}" ]]; then
  AWS_ARGS=(--profile "${AWS_PROFILE:-personal}")
fi

"$ROOT_DIR/scripts/verify.sh"

DISTRIBUTION_ID="${DISTRIBUTION_ID:-}"

if [[ -z "$DISTRIBUTION_ID" ]]; then
  DISTRIBUTION_ID="$(aws cloudfront list-distributions \
    "${AWS_ARGS[@]}" \
    --query "DistributionList.Items[?Aliases.Items && contains(Aliases.Items, '$DOMAIN')].Id | [0]" \
    --output text)"
fi

if [[ -z "$DISTRIBUTION_ID" || "$DISTRIBUTION_ID" == "None" ]]; then
  echo "No CloudFront distribution found for $DOMAIN" >&2
  exit 1
fi

aws s3 sync \
  "$ROOT_DIR/dist/client/" \
  "s3://$BUCKET/" \
  --delete \
  --cache-control "public,max-age=300" \
  "${AWS_ARGS[@]}" \
  --only-show-errors

aws s3 cp \
  "$ROOT_DIR/dist/client/index.html" \
  "s3://$BUCKET/index.html" \
  --content-type "text/html; charset=utf-8" \
  --cache-control "no-cache,max-age=0,must-revalidate" \
  "${AWS_ARGS[@]}" \
  --only-show-errors

aws s3 cp \
  "$ROOT_DIR/dist/client/manifest.webmanifest" \
  "s3://$BUCKET/manifest.webmanifest" \
  --content-type "application/manifest+json" \
  --cache-control "no-cache,max-age=0,must-revalidate" \
  "${AWS_ARGS[@]}" \
  --only-show-errors

INVALIDATION_ID="$(aws cloudfront create-invalidation \
  --distribution-id "$DISTRIBUTION_ID" \
  --paths "/*" \
  "${AWS_ARGS[@]}" \
  --query 'Invalidation.Id' \
  --output text)"

aws cloudfront wait invalidation-completed \
  --distribution-id "$DISTRIBUTION_ID" \
  --id "$INVALIDATION_ID" \
  "${AWS_ARGS[@]}"

echo "Published https://$DOMAIN/"
echo "CloudFront distribution: $DISTRIBUTION_ID"
echo "CloudFront invalidation: $INVALIDATION_ID"
