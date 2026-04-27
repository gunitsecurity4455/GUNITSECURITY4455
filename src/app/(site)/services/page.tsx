import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getPublishedServices, getSiteSettings } from "@/lib/site-data";
import { resolveIcon } from "@/lib/icons";
import { PageHero } from "@/components/shared/PageHero";
import { CTASection } from "@/components/home/CTASection";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Premium security services from G Unit Security — VIP protection, crowd control, CCTV, mobile patrols, canine security and more. Perth WA.",
};

export const revalidate = 300;

export default async function ServicesPage() {
  const [services, settings] = await Promise.all([getPublishedServices(), getSiteSettings()]);

  return (
    <>
      <PageHero
        title={
          <>
            Our <span className="brand-gradient-text">Services</span>
          </>
        }
        subtitle="Eight tailored security solutions, built on rigorous training and the highest licensing standards in Western Australia."
        breadcrumbs={[{ href: "/", label: "Home" }, { label: "Services" }]}
      />

      <section className="py-24">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8 space-y-24">
          {services.map((service, i) => {
            const Icon = resolveIcon(service.icon);
            const reversed = i % 2 === 1;
            return (
              <article
                key={service.id}
                id={service.slug}
                className={`grid lg:grid-cols-2 gap-12 items-center ${
                  reversed ? "lg:flex-row-reverse" : ""
                }`}
              >
                <div className={`space-y-6 ${reversed ? "lg:order-2" : ""}`}>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-red-primary/20 to-blue-primary/20 flex items-center justify-center border border-navy-light">
                      <Icon className="w-7 h-7 text-red-bright" />
                    </div>
                    <span className="font-display text-4xl text-off-white/20 tracking-wider">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h2 className="font-display text-5xl sm:text-6xl tracking-wider">
                    {service.title}
                  </h2>
                  <p className="text-gray-mid text-lg leading-relaxed whitespace-pre-line">
                    {service.longDesc}
                  </p>
                  <Link
                    href={`/services/${service.slug}`}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-red-primary to-red-deep hover:from-red-bright hover:to-red-primary text-white text-xs tracking-[3px] uppercase font-medium px-7 py-3.5 rounded-lg transition shadow-[0_15px_40px_-15px_rgba(200,16,46,0.5)]"
                  >
                    Full Details
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                <div
                  className={`relative aspect-[4/3] rounded-2xl overflow-hidden border border-navy-light bg-navy-rich flex items-center justify-center ${
                    reversed ? "lg:order-1" : ""
                  }`}
                >
                  {service.imageUrl ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={service.imageUrl}
                        alt={service.title}
                        loading="lazy"
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-tr from-pure-black/60 via-transparent to-transparent pointer-events-none" />
                    </>
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-br from-red-primary/20 via-transparent to-blue-primary/20" />
                      <div className="absolute inset-0 grid-bg opacity-50" />
                      <Icon className="relative w-32 h-32 text-red-bright/40" />
                    </>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <CTASection settings={settings} />
    </>
  );
}
