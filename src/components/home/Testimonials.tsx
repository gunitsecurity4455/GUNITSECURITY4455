import { Star } from "lucide-react";
import type { Testimonial } from "@prisma/client";
import { SectionLabel } from "@/components/shared/SectionLabel";

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function Testimonials({ items }: { items: Testimonial[] }) {
  return (
    <section className="py-24 bg-navy-rich/40">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-5">
          <SectionLabel>Client Testimonials</SectionLabel>
          <h2 className="font-display text-5xl sm:text-6xl tracking-wider">
            Words From <span className="brand-gradient-text">Our Clients</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {items.slice(0, 6).map((t) => (
            <article
              key={t.id}
              className="relative bg-navy-rich border border-navy-light hover:border-gold-accent/30 rounded-2xl p-7 transition hover:-translate-y-1"
            >
              <span className="absolute top-4 right-5 font-display text-7xl text-red-primary/20 leading-none">
                &ldquo;
              </span>
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-gold-accent text-gold-accent" />
                ))}
              </div>
              <p className="text-off-white/85 text-sm leading-relaxed mb-6 relative">
                {t.quote}
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-navy-light">
                {t.avatarUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={t.avatarUrl}
                    alt={t.name}
                    className="w-11 h-11 rounded-full object-cover border border-navy-light"
                  />
                ) : (
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-red-primary to-blue-primary flex items-center justify-center font-display text-sm tracking-widest">
                    {initials(t.name)}
                  </div>
                )}
                <div>
                  <h4 className="font-medium text-off-white text-sm">{t.name}</h4>
                  <p className="text-xs text-gray-mid">
                    {t.role}
                    {t.company ? ` · ${t.company}` : ""}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
