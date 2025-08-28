## Overview

Next.js 15 app with MySQL for products/categories and local file uploads for images.

## Environment Variables

Create `.env.local` for dev and `.env.production` for prod with:

```
DB_HOST=...
DB_USER=...
DB_PASSWORD=...
DB_NAME=...
DB_PORT=3306
# Optional upload overrides
UPLOADS_DIR=/absolute/path/to/uploads
UPLOADS_PUBLIC_BASE=/uploads
```

## Local Development

1. Install deps: `pnpm install`
2. Start MySQL and create database from `DB_NAME`
3. Run dev: `pnpm dev`

Tables auto-create on first request via `src/lib/db.ts`.

## API

- Products: `GET/POST /api/products`, `GET/PUT/DELETE /api/products/[id]`
- Categories: `GET/POST/PUT/DELETE /api/categories`
- Upload: `POST /api/upload` returns `{ url, filename }`

## File Uploads

- Stored under `public/uploads` by default (configurable with `UPLOADS_DIR`)
- Served statically by Next.js
- Ignored by git via `.gitignore`

## Deploy to Vercel

- Set the DB env vars in Vercel Project Settings
- Ensure `runtime = "nodejs"` is set in routes that use fs (done for `/api/upload`)
- Build and deploy as usual

## Deploy to VPS

1. Clone repo and `pnpm install`
2. Configure `.env.production`
3. Create uploads dir: `mkdir -p public/uploads && chmod 755 public/uploads`
4. Build: `pnpm build`
5. Start with pm2: `pm2 start pnpm --name melvin-diamonds -- start`
6. Configure reverse proxy (nginx) to Node server port

## Security & Notes

- Never commit `.env*` or `uploads/`
- API validates input and uses prepared statements
- JSON columns parsed server-side for consistent shape
