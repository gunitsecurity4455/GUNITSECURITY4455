import Link from "next/link";
import { ArrowRight, Mail, MapPin } from "lucide-react";
import type { SiteSettings } from "@prisma/client";

export function CTASection({ settings }: { settings: SiteSettings | null }) {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-br from-red-primary/15 via-transparent to-blue-primary/15 pointer-events-none" />
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8 relative">
        <div className="text-center max-w-3xl mx-auto space-y-8">
          <h2 className="font-display text-5xl sm:text-7xl tracking-wider leading-[0.95]">
            Ready For <span className="brand-gradient-text">Uncompromising</span>
            <br />
            Security?
          </h2>
          <p className="text-gray-mid text-lg leading-relaxed">
            Get a tailored security solution for your business. Our team is standing by 24/7 to
            discuss your needs and provide an instant quote.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 bg-gradient-to-r from-red-primary to-red-deep hover:from-red-bright hover:to-red-primary text-white text-xs tracking-[3px] uppercase font-medium px-8 py-4 rounded-lg transition shadow-[0_20px_50px_-15px_rgba(200,16,46,0.6)]"
            >
              Request Free Quote
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </Link>
            {settings?.phone && (
              <a
                href={`tel:${settings.phone.replace(/\s/g, "")}`}
                className="inline-flex items-center gap-2 border border-off-white/20 hover:border-off-white/50 text-off-white text-xs tracking-[3px] uppercase font-medium px-8 py-4 rounded-lg transition"
              >
                Call {settings.phone}
              </a>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-sm text-gray-mid">
            {settings?.email && (
              <a href={`mailto:${settings.email}`} className="inline-flex items-center gap-2 hover:text-off-white">
                <Mail className="w-4 h-4 text-red-bright" /> {settings.email}
              </a>
            )}
            {settings?.address && (
              <span className="inline-flex items-center gap-2">
                <MapPin className="w-4 h-4 text-red-bright" />
                {settings.address.split(",").slice(-2).join(",").trim() || "Perth, WA"}
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
