import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ship Prisma's schema into the serverless functions bundle so the
  // query engine can find it at runtime.
  outputFileTracingIncludes: {
    "/**/*": ["./prisma/schema.prisma"],
  },
  // Allow next/image to render Vercel Blob URLs (the upload destination).
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
  },
};

export default nextConfig;
