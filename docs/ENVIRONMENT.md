# Environment variables

The repository contains two different environment files:

- `.env.local` — local development only. It is ignored by Git through `.env*` in `.gitignore`.
- `/etc/legitmate/legitmate.env` — production secrets loaded by `legitmate.service` on the VPS.

Never commit `.env.local`, and never put private secrets in `.env.example`.

## Local development

```bash
cp .env.example .env.local
# edit .env.local
npm run dev
```

`NEXT_PUBLIC_PRIVY_APP_ID` is a client-visible Privy app identifier. `PRIVY_APP_SECRET` and `AGENT37_API_KEY` are server-only secrets and must never use the `NEXT_PUBLIC_` prefix.

## Production

Copy values into the VPS environment file:

```bash
sudoedit /etc/legitmate/legitmate.env
sudo chmod 600 /etc/legitmate/legitmate.env
sudo systemctl daemon-reload
sudo systemctl restart legitmate.service
```

After changing production variables, rebuild the Next.js app because `NEXT_PUBLIC_PRIVY_APP_ID` is embedded into the client bundle during build:

```bash
cd /root/legitmate
npm run build
sudo systemctl restart legitmate.service
```

Check health without printing secrets:

```bash
systemctl is-active legitmate.service
curl http://127.0.0.1:3200/api/health
```
