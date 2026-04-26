import type { ReactNode } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AIChatbot } from "@/components/shared/AIChatbot";

// Footer reads live data from Prisma, so every public page must render
// at request time — never prerendered at build. Applies to every page
// under the (site) route group.
export const dynamic = "force-dynamic";

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
