import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle } from "lucide-react";
import {
  getServiceBySlug,
  getPublishedServices,
  getSiteSettings,
} from "@/lib/site-data";
import { resolveIcon } from "@/lib/icons";
import { PageHero } from "@/components/shared/PageHero";
import { CTASection } from "@/components/home/CTASection";

export const revalidate = 300;
export const dynamicParams = true;

// Pre-build every published service page at build time — anonymous
// traffic hits a static HTML file and never waits on Prisma. If the
// build env can't reach the DB (e.g. sandboxed CI without Neon), we
// fall back to an empty list and `dynamicParams: true` lets the page
// render at request time instead.
export async function generateStaticParams() {
  try {
    const { prisma } = await import("@/lib/prisma");
    const services = await prisma.service.findMany({
      where: { published: true },
      select: { slug: true },
    });
    return services.map((s) => ({ slug: s.slug }));
  } catch (err) {
    console.warn("[services/[slug]] generateStaticParams skipped:", err);
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) return {};
  return {
    title: service.title,
    description: service.shortDesc,
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [service, all, settings] = await Promise.all([
    getServiceBySlug(slug),
    getPublishedServices(),
    getSiteSettings(),
  ]);
  if (!service) notFound();

  const others = all.filter((s) => s.id !== service.id).slice(0, 3);
  const Icon = resolveIcon(service.icon);
  const features = Array.isArray(service.features) ? (service.features as string[]) : [];

  return (
    <>
      <PageHero
        title={service.title}
        subtitle={service.shortDesc}
        breadcrumbs={[
          { href: "/", label: "Home" },
          { href: "/services", label: "Services" },
          { label: service.title },
        ]}
      />

      {service.imageUrl && (
        <section className="relative -mt-8">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
            <div className="relative aspect-[16/7] rounded-2xl overflow-hidden border border-white/8 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={service.imageUrl}
                alt={service.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/40 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>
        </section>
      )}

      <section className="py-20">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8 grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-red-primary/20 to-blue-primary/20 flex items-center justify-center border border-navy-light">
              <Icon className="w-9 h-9 text-red-bright" />
            </div>
            <div className="prose prose-invert max-w-none">
              <p className="text-off-white/85 text-lg leading-relaxed whitespace-pre-line">
                {service.longDesc}
              </p>
            </div>

            {features.length > 0 && (
              <div className="bg-navy-rich border border-navy-light rounded-2xl p-7">
                <h2 className="font-display text-2xl tracking-wider mb-5">What&apos;s Included</h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2.5 text-sm text-off-white/85"
                    >
                      <CheckCircle className="w-4 h-4 text-red-bright flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-red-primary to-red-deep hover:from-red-bright hover:to-red-primary text-white text-xs tracking-[3px] uppercase font-medium px-7 py-3.5 rounded-lg transition shadow-[0_15px_40px_-15px_rgba(200,16,46,0.5)]"
              >
                Request a Quote
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center gap-2 border border-off-white/20 hover:border-off-white/50 text-off-white text-xs tracking-[3px] uppercase font-medium px-7 py-3.5 rounded-lg transition"
              >
                All Services
              </Link>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="bg-navy-rich border border-navy-light rounded-2xl p-6 space-y-4">
              <h3 className="font-display text-xl tracking-wider">Why G Unit</h3>
              <ul className="space-y-3">
                {[
                  "Fully licensed by WA",
                  "$20M Public & Professional Indemnity",
                  "15+ years of operational experience",
                  "24/7 rapid response ready",
                ].map((point) => (
                  <li key={point} className="flex items-start gap-2.5 text-sm text-off-white/80">
                    <CheckCircle className="w-4 h-4 text-red-bright flex-shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {others.length > 0 && (
              <div className="bg-navy-rich border border-navy-light rounded-2xl p-6 space-y-3">
                <h3 className="font-display text-xl tracking-wider mb-2">Other Services</h3>
                {others.map((s) => (
                  <Link
                    key={s.id}
                    href={`/services/${s.slug}`}
                    className="flex items-center justify-between py-2 text-sm text-off-white/80 hover:text-red-bright transition border-b border-navy-light last:border-b-0"
                  >
                    <span>{s.title}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                ))}
              </div>
            )}
          </aside>
        </div>
      </section>

      <CTASection settings={settings} />
    </>
  );
}
