# Deployment Guide

## ⚠️ SQLite on Vercel — read-only in production

The current setup uses **SQLite** (`prisma/dev.db`) committed into the
serverless function bundle. That means:

| What | Works on Vercel? |
|---|---|
| Public site — home, services, about, contact, career | ✅ Yes (reads) |
| Admin login + dashboard + viewing content | ✅ Yes (reads) |
| Admin creating, editing, or deleting content | ❌ **No — writes fail** |
| Public contact form submissions | ❌ **No — writes fail** |
| Public career form submissions | ❌ **No — writes fail** |

Vercel's serverless filesystem is **read-only** at runtime. Anything you
write to `prisma/dev.db` disappears with the next invocation — and most
of the time the write itself fails because the bundle is read-only.

**To get write-capable production, switch the datasource to Postgres
(one-click Vercel Postgres) or Turso. See "Upgrading to Postgres" below.**

---

## First-time Vercel setup

### 1. Connect the repo

Import the repo in Vercel → pick `claude/review-website-files-Kek9s` or
whichever branch you merge to `main`.

### 2. Set environment variables

In Vercel → Project → Settings → Environment Variables, add:

| Key | Value | Notes |
|---|---|---|
| `DATABASE_URL` | `file:./dev.db` | Relative to `prisma/` |
| `NEXTAUTH_URL` | `https://your-domain.vercel.app` | Your deployed URL |
| `NEXTAUTH_SECRET` | generate with `openssl rand -base64 32` | Keep secret |
| `DEFAULT_ADMIN_EMAIL` | `admin@gunitsecurity.com.au` | Only used on first seed |
| `DEFAULT_ADMIN_PASSWORD` | a strong password | Only used on first seed |

All five must be present or the build fails.

### 3. Deploy

`npm run build` on Vercel runs:

```
prisma generate && prisma migrate deploy && tsx prisma/seed.ts && next build
```

This creates `prisma/dev.db`, applies migrations, seeds the default
content, and builds Next.js. The `next.config.ts` `outputFileTracingIncludes`
ships the schema, migrations, and DB file into the serverless functions.

Seed is idempotent — it only creates rows that don't exist, so re-running
on deploy won't overwrite admin edits (in environments where edits survive,
which is not Vercel + SQLite — see above).

### 4. Log in

Visit `/admin/login` with the email and password you set in step 2.

---

## Local development

```bash
cp .env.example .env    # then edit DATABASE_URL, NEXTAUTH_SECRET, etc
npm install
npm run db:migrate       # creates prisma/dev.db, applies migrations, runs seed
npm run dev              # http://localhost:3000
```

Admin: `http://localhost:3000/admin/login`

---

## Upgrading to Postgres (recommended for real production)

1. Provision a Postgres DB — on Vercel it's one click: Storage → Create
   Database → Postgres. Vercel sets `DATABASE_URL` automatically.
2. Edit `prisma/schema.prisma`:

   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
3. Delete the existing SQLite migrations and re-create one for Postgres:

   ```bash
   rm -rf prisma/migrations prisma/dev.db
   npx prisma migrate dev --name init
   ```
4. Remove the SQLite-specific ignores from `.gitignore` and the
   `outputFileTracingIncludes` block from `next.config.ts` — both are
   SQLite-only concerns.
5. Push and redeploy. Admin edits will now persist; contact and career
   submissions will work.

---

## Upgrading to Turso (SQLite-as-a-service, no provider change)

Turso is remote SQLite with the same Prisma driver. Good if you want to
keep the SQLite mental model without Postgres.

1. Sign up at turso.tech, create a database, copy the libSQL URL + auth token.
2. Install driver: `npm install @libsql/client @prisma/adapter-libsql`.
3. Replace the default Prisma client construction with a Turso adapter —
   see Prisma docs: https://www.prisma.io/docs/orm/overview/databases/turso
4. Set `DATABASE_URL` (libsql://...) and `DATABASE_AUTH_TOKEN` on Vercel.
5. Deploy.

---

## Common deploy failures

- **Environment variable not found: DATABASE_URL** — Vercel env vars
  missing. Add them in project settings.
- **Error occurred prerendering page** — a page is statically rendered
  but calls Prisma. Add `export const dynamic = "force-dynamic"` to the
  offending page or its parent layout.
- **Prisma Client could not find the binary** — ensure
  `outputFileTracingIncludes` in `next.config.ts` includes the
  `prisma/schema.prisma` file (already done in this repo).
