import type { Industry } from "@prisma/client";
import { SectionLabel } from "@/components/shared/SectionLabel";
import { Reveal, RevealStagger } from "@/components/shared/Reveal";
import { resolveIcon } from "@/lib/icons";

export function IndustriesSection({ industries }: { industries: Industry[] }) {
  return (
    <section className="py-32">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <Reveal className="text-center max-w-2xl mx-auto mb-20 space-y-6">
          <SectionLabel>Industries We Serve</SectionLabel>
          <h2 className="font-display text-5xl sm:text-7xl tracking-wider">
            Trusted Across <span className="brand-gradient-text">Sectors</span>
          </h2>
          <p className="font-serif italic text-xl text-off-white/65 leading-relaxed">
            Specialised security solutions tailored to the unique demands of every industry we
            serve.
          </p>
        </Reveal>

        <RevealStagger
          stagger={0.07}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {industries.map((industry, i) => {
            const Icon = resolveIcon(industry.icon);
            return (
              <article
                key={industry.id}
                className="group relative card-luxury rounded-2xl overflow-hidden min-h-[360px] flex flex-col"
              >
                {industry.imageUrl ? (
                  <>
                    {/* Photo background */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={industry.imageUrl}
                      alt={industry.title}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-pure-black via-pure-black/75 to-pure-black/20 pointer-events-none" />
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-primary/15 to-transparent pointer-events-none" />
                  </>
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-primary/8 via-transparent to-red-primary/8 pointer-events-none" />
                )}

                <div className="relative p-7 flex flex-col h-full justify-end z-10">
                  <div className="w-12 h-12 rounded-xl bg-pure-black/50 backdrop-blur-md flex items-center justify-center mb-5 border border-white/15 group-hover:border-gold-accent/40 transition-colors">
                    <Icon className="w-5 h-5 text-blue-light group-hover:text-gold-bright transition-colors" />
                  </div>
                  <p className="text-[10px] tracking-[4px] text-gold-bright/80 uppercase mb-2">
                    {String(i + 1).padStart(2, "0")} / {String(industries.length).padStart(2, "0")}
                  </p>
                  <h3 className="font-display text-2xl tracking-wider mb-3 group-hover:gold-gradient-text transition-all">
                    {industry.title}
                  </h3>
                  <p className="text-off-white/75 text-sm leading-relaxed">
                    {industry.description}
                  </p>
                </div>
              </article>
            );
          })}
        </RevealStagger>
      </div>
    </section>
  );
}
