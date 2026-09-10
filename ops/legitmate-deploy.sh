#!/usr/bin/env bash
set -Eeuo pipefail
cd /root/legitmate
exec 9>/run/legitmate-deploy.lock
flock -n 9 || { echo 'deploy already running'; exit 0; }

git fetch origin main
git checkout -q main
git reset --hard origin/main
if [[ -n "${EXPECTED_SHA:-}" && "$(git rev-parse HEAD)" != "$EXPECTED_SHA" ]]; then
  echo "checked out $(git rev-parse HEAD), expected $EXPECTED_SHA" >&2
  exit 1
fi
export PATH=/root/.nvm/versions/node/v22.22.2/bin:$PATH
rm -rf node_modules
npm ci
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
