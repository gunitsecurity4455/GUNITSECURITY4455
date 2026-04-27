import type { ReactNode } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AIChatbot } from "@/components/shared/AIChatbot";

// Cache the rendered tree for 60s. Server actions that mutate content
// call revalidatePath('/', 'layout') so admin edits still appear within
// a few seconds, but anonymous traffic hits the cache and never blocks
// on a Prisma round-trip per request. This is the single biggest perf
// win on the public site — pages used to force-dynamic on every hit.
export const revalidate = 60;

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex-1 flex flex-col">
      <Navbar />
      <div className="flex-1 pt-[72px]">{children}</div>
      <Footer />
      <AIChatbot />
    </div>
  );
}
