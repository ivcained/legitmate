#!/usr/bin/env bash
set -Eeuo pipefail

readonly APP_DIR=/root/legitmate
readonly NODE_BIN=/root/.nvm/versions/node/v24.6.0/bin
export PATH="$NODE_BIN:/usr/bin:/bin"

[[ -x "$NODE_BIN/node" && -x "$NODE_BIN/npm" ]] || {
  echo "pinned Node installation is missing: $NODE_BIN" >&2
  exit 1
}
[[ -n "${EXPECTED_SHA:-}" && "$EXPECTED_SHA" =~ ^[0-9a-f]{40}$ ]] || {
  echo 'EXPECTED_SHA must be the 40-character pushed Git SHA' >&2
  exit 1
}

cd "$APP_DIR"
exec 9>/run/legitmate-deploy.lock
flock -n 9 || { echo 'deploy already running'; exit 0; }

git fetch --prune origin main
git checkout -q main
git reset --hard origin/main
actual_sha=$(git rev-parse HEAD)
if [[ "$actual_sha" != "$EXPECTED_SHA" ]]; then
  echo "checked out $actual_sha, expected $EXPECTED_SHA" >&2
  exit 1
fi

rm -rf node_modules .next
npm ci
node -e "require.resolve('next/package.json')"
npm run lint
npm run typecheck
npm test -- --run
npm run build
systemctl restart legitmate.service
for i in $(seq 1 30); do
  if systemctl is-active --quiet legitmate.service && curl -fsS http://127.0.0.1:3200/api/health >/tmp/legitmate-health.json; then
    cat /tmp/legitmate-health.json
    exit 0
  fi
  sleep 2
done
journalctl -u legitmate.service -n 80 --no-pager
exit 1
