import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ship Prisma's schema into the serverless functions bundle so the
  // query engine can find it at runtime.
  outputFileTracingIncludes: {
    "/**/*": ["./prisma/schema.prisma"],
  },
};

export default nextConfig;
