"use client";

import dynamic from "next/dynamic";

// SSR off: leaflet imports `window` at module load.
const CoverageMap = dynamic(
  () => import("./CoverageMap").then((m) => m.CoverageMap),
  {
    ssr: false,
    loading: () => (
      <div className="py-32 text-center text-off-white/40 text-sm">Loading coverage map…</div>
    ),
  }
);

export function CoverageMapLoader() {
  return <CoverageMap />;
}
