#!/usr/bin/env node
/**
 * Build orchestrator for local `npm run build` and Vercel deploys.
 *
 * 1. Normalises env vars — maps Neon/Vercel's `DATABASE_URL_UNPOOLED` onto
 *    `DIRECT_URL` so the Prisma schema resolves without extra manual config
 *    on Vercel.
 * 2. Fails fast with a specific, copy-pasteable list if any required var is
 *    still missing after the mapping step.
 * 3. Runs the full build pipeline: prisma generate → db push → seed →
 *    next build, inheriting the normalised environment.
 */

import { execSync } from "node:child_process";

const REQUIRED = [
  "DATABASE_URL",
  "NEXTAUTH_SECRET",
  "NEXTAUTH_URL",
  "DEFAULT_ADMIN_EMAIL",
  "DEFAULT_ADMIN_PASSWORD",
];

function resolveDirectUrl() {
  if (process.env.DIRECT_URL) return { key: "DIRECT_URL (already set)", value: process.env.DIRECT_URL };

  const candidates = [
    ["DATABASE_URL_UNPOOLED", process.env.DATABASE_URL_UNPOOLED],
    ["POSTGRES_URL_NON_POOLING", process.env.POSTGRES_URL_NON_POOLING],
    ["DATABASE_URL", process.env.DATABASE_URL], // last resort, same as pooled
  ];
  for (const [key, value] of candidates) {
    if (value) return { key, value };
  }
  return null;
}

function main() {
  const resolved = resolveDirectUrl();
  if (resolved) {
    process.env.DIRECT_URL = resolved.value;
    console.log(`[build] DIRECT_URL resolved from ${resolved.key}`);
  }

  const missing = REQUIRED.filter((k) => !process.env[k]);
  if (missing.length > 0) {
    console.error("\n[build] Missing required environment variables:");
    for (const k of missing) console.error("  - " + k);
    console.error(
      "\nSet these in Vercel → Project → Settings → Environment Variables " +
        "(Production + Preview + Development), then redeploy.\n"
    );
    process.exit(1);
  }

  const steps = [
    "prisma generate",
    "prisma db push --skip-generate --accept-data-loss",
    "tsx prisma/seed.ts",
    "next build",
  ];

  for (const step of steps) {
    console.log(`\n[build] $ ${step}`);
    execSync(step, { stdio: "inherit", env: process.env });
  }
}

main();
