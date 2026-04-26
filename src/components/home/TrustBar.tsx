import type { Partner } from "@prisma/client";

export function TrustBar({ partners }: { partners: Partner[] }) {
  if (partners.length === 0) return null;

  // Duplicate for seamless marquee
  const items = [...partners, ...partners];

  return (
    <section className="border-y border-navy-light bg-navy-rich/40 py-8 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8 flex flex-col md:flex-row items-center gap-8">
        <p className="text-xs tracking-[4px] text-gray-mid uppercase flex-shrink-0">
          Trusted Credentials
        </p>
        <div className="flex-1 overflow-hidden relative w-full md:w-auto">
          <div className="flex items-center gap-16 animate-[marquee_40s_linear_infinite]">
            {items.map((p, i) =>
              p.logoUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  key={`${p.id}-${i}`}
                  src={p.logoUrl}
                  alt={p.name}
                  className="h-10 w-auto object-contain opacity-70 hover:opacity-100 transition flex-shrink-0"
                />
              ) : (
                <span
                  key={`${p.id}-${i}`}
                  className="font-display text-2xl tracking-[4px] text-off-white/40 hover:text-off-white transition whitespace-nowrap"
                >
                  {p.name}
                </span>
              )
            )}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}
