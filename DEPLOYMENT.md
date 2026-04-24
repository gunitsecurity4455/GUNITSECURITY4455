# Deployment Guide

The app runs on **Postgres** via Prisma, deployed to **Vercel**.
Admin CRUD, contact form submissions, and career applications all
persist because the database lives outside the serverless filesystem.

---

## First-time Vercel setup

### 1. Connect the repo

Import the repo in Vercel and accept the defaults. Framework should be
auto-detected as Next.js.

### 2. Provision Vercel Postgres

In the Vercel dashboard:

1. Open the project → **Storage** tab → **Create Database** → **Postgres**.
2. Pick a name (e.g. `gunit-security-db`), region close to your users.
3. Vercel automatically sets `DATABASE_URL` (and related `POSTGRES_*`
   vars) as project environment variables across Production, Preview,
   and Development. Nothing to copy manually.

### 3. Add the remaining environment variables

Still under **Settings → Environment Variables**, add these four:

| Key | Value | Notes |
|---|---|---|
| `NEXTAUTH_URL` | `https://<your-domain>` | Full production URL, no trailing slash |
| `NEXTAUTH_SECRET` | output of `openssl rand -base64 32` | Keep secret |
| `DEFAULT_ADMIN_EMAIL` | `admin@gunitsecurity.com.au` | Only used by first seed |
| `DEFAULT_ADMIN_PASSWORD` | a strong password | Only used by first seed |

Apply each to **Production + Preview + Development**.

### 4. Deploy

Push to `main`. Vercel runs:

```
prisma generate
prisma db push --skip-generate --accept-data-loss
tsx prisma/seed.ts
next build
```

`db push` syncs the schema to the live Postgres (creates all tables on
first deploy, no-ops after). Seed is idempotent — it only inserts rows
that don't already exist, so re-running on every deploy never overwrites
admin edits.

### 5. Log in

Go to `/admin/login`, enter the email and password you set in step 3.

---

## Local development

### Option A: local Postgres (via Docker)

```bash
docker run --name gunit-pg -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=gunit -p 5432:5432 -d postgres:16
```

Then:

```bash
cp .env.example .env.local
# edit .env.local: DATABASE_URL="postgresql://postgres:postgres@localhost:5432/gunit?schema=public"
npm install
npm run db:push      # creates all tables
npm run db:seed      # populates content + default admin
npm run dev
```

### Option B: connect to Vercel Postgres dev branch

Vercel Postgres supports branching. Pull the branch credentials with
`vercel env pull .env.local` and run `npm run dev` — no local DB
needed.

Visit `http://localhost:3000/admin/login`.

---

## Schema changes

This project uses `prisma db push` rather than migration files, which
is fine for a small, iterating codebase. For every schema change:

1. Edit `prisma/schema.prisma`.
2. `npm run db:push` to apply locally.
3. Commit both the schema change and any code that depends on it.
4. Push — Vercel applies `db push` on the next build.

If you later want migration history, run `npx prisma migrate dev --name <name>`
after changing the schema. Migration files will be generated; update
the build script to `prisma migrate deploy` instead of `db push`.

---

## Common deploy failures

- **`P1012: Environment variable not found: DATABASE_URL`** — Vercel
  Postgres wasn't provisioned or was deleted. Re-attach via Storage
  tab.
- **`P1001: Can't reach database server`** — the DB is paused or the
  connection string is stale. Check the Postgres instance status in
  Storage tab.
- **`Prisma Client could not find the binary`** — ensure
  `binaryTargets` in `schema.prisma` includes `rhel-openssl-3.0.x`
  (already set in this repo).
- **Blank page / prerender error on a public route** — confirm the
  route has `export const dynamic = "force-dynamic"` or is covered by
  a parent layout that does (already the case for everything under
  `(site)`).
