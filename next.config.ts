import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ship the Prisma schema, migrations, and the SQLite db file into the
  // serverless functions bundle on Vercel. Without this, Prisma fails at
  // runtime because schema.prisma and dev.db are not in the standalone
  // output by default. Note: SQLite on Vercel is read-only at runtime,
  // so writes from the admin panel will NOT persist across invocations.
  // For write-capable production, switch datasource to Postgres.
  outputFileTracingIncludes: {
    "/**/*": [
      "./prisma/schema.prisma",
      "./prisma/dev.db",
      "./prisma/migrations/**/*",
    ],
  },
};

export default nextConfig;
