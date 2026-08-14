#!/bin/sh
set -e
DIR="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"

if [ -n "$CLOUDFLARE_TUNNEL_TOKEN" ] && [ -x "$DIR/cloudflared" ]; then
  echo "Starting Cloudflare Tunnel..."
  "$DIR/cloudflared" tunnel run --token "$CLOUDFLARE_TUNNEL_TOKEN" &
fi

exec node "$DIR/index.js"
