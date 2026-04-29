import Link from "next/link";
import { Facebook, Instagram, Linkedin, MapPin, Phone, Mail } from "lucide-react";
import { getSiteSettings, getPublishedServices } from "@/lib/site-data";

const socialMap = [
  { icon: Facebook, key: "facebookUrl" as const, label: "Facebook" },
  { icon: Instagram, key: "instagramUrl" as const, label: "Instagram" },
  { icon: Linkedin, key: "linkedinUrl" as const, label: "LinkedIn" },
];

export async function Footer() {
  const [settings, services] = await Promise.all([getSiteSettings(), getPublishedServices()]);

  return (
    <footer className="mt-24 border-t border-navy-light bg-navy-rich">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-1">
            <Link href="/" className="inline-flex items-center gap-3">
              {settings?.logoUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={settings.logoUrl}
                  alt={settings.companyName ?? "G-Unit Security"}
                  style={{ height: `${settings.logoHeight ?? 48}px` }}
                  className="w-auto object-contain"
                />
              ) : (
                <span className="font-display text-3xl tracking-[3px]">
                  <span className="brand-gradient-text">G-UNIT</span>
                  <span className="text-off-white/80 ml-2 text-sm tracking-[4px] font-body font-medium">
                    SECURITY
                  </span>
                </span>
              )}
            </Link>
            {settings?.tagline && (
              <p className="text-off-white/90 text-sm mt-3 font-medium tracking-wider">
                {settings.tagline}
              </p>
            )}
            <p className="text-gray-mid text-sm mt-4 leading-relaxed">
              {settings?.description ??
                "Privately owned Western Australian company delivering reliable security solutions across Perth and surrounds."}
            </p>
            <div className="flex items-center gap-3 mt-6">
              {socialMap.map(({ icon: Icon, key, label }) => {
                const url = settings?.[key];
                if (!url) return null;
                return (
                  <a
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    className="w-9 h-9 flex items-center justify-center rounded-lg border border-navy-light text-gray-mid hover:text-red-bright hover:border-red-primary/40 transition"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          <div>
            <h4 className="font-display text-lg tracking-wider mb-4">Services</h4>
            <ul className="space-y-2.5 text-sm">
              {services.slice(0, 8).map((s) => (
                <li key={s.id}>
                  <Link
                    href={`/services/${s.slug}`}
                    className="text-gray-mid hover:text-red-bright transition"
                  >
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-lg tracking-wider mb-4">Company</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/about" className="text-gray-mid hover:text-red-bright transition">About Us</Link></li>
              <li><Link href="/team" className="text-gray-mid hover:text-red-bright transition">Our Team</Link></li>
              <li><Link href="/career" className="text-gray-mid hover:text-red-bright transition">Careers</Link></li>
              <li><Link href="/contact" className="text-gray-mid hover:text-red-bright transition">Contact</Link></li>
              <li><Link href="/contact" className="text-gray-mid hover:text-red-bright transition">Get a Quote</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-lg tracking-wider mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              {settings?.address && (
                <li className="flex gap-3 text-gray-mid">
                  <MapPin className="w-4 h-4 mt-0.5 text-red-bright flex-shrink-0" />
                  <span className="whitespace-pre-line">{settings.address}</span>
                </li>
              )}
              {settings?.phone && (
                <li className="flex gap-3">
                  <Phone className="w-4 h-4 mt-0.5 text-red-bright flex-shrink-0" />
                  <a href={`tel:${settings.phone.replace(/\s/g, "")}`} className="text-gray-mid hover:text-off-white">
                    {settings.phone}
                  </a>
                </li>
              )}
              {settings?.email && (
                <li className="flex gap-3">
                  <Mail className="w-4 h-4 mt-0.5 text-red-bright flex-shrink-0" />
                  <a href={`mailto:${settings.email}`} className="text-gray-mid hover:text-off-white break-all">
                    {settings.email}
                  </a>
                </li>
              )}
              {settings?.generalEmail && settings.generalEmail !== settings.email && (
                <li className="flex gap-3">
                  <Mail className="w-4 h-4 mt-0.5 text-red-bright flex-shrink-0" />
                  <a
                    href={`mailto:${settings.generalEmail}`}
                    className="text-gray-mid hover:text-off-white break-all"
                  >
                    {settings.generalEmail}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-navy-light flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-gray-mid">
          <p>
            © {new Date().getFullYear()} {settings?.companyName ?? "G-Unit Security"}. All Rights Reserved.
          </p>
          <p>
            Licensed Security Provider · {settings?.region ?? "Western Australia"}
          </p>
        </div>
      </div>
    </footer>
  );
}
