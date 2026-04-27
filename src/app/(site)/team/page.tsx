import type { Metadata } from "next";
import Image from "next/image";
import { Mail, Phone } from "lucide-react";
import { getActiveTeamMembers, getSiteSettings } from "@/lib/site-data";
import { PageHero } from "@/components/shared/PageHero";
import { SectionLabel } from "@/components/shared/SectionLabel";
import { CTASection } from "@/components/home/CTASection";

export const metadata: Metadata = {
  title: "Our Team",
  description:
    "Meet the leadership behind G-Unit Security — director, business development, operations, scheduling and client services.",
};

export const revalidate = 300;

type Responsibility = { title?: string; description?: string };

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .filter((c) => /[A-Za-z]/.test(c))
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default async function TeamPage() {
  const [team, settings] = await Promise.all([getActiveTeamMembers(), getSiteSettings()]);

  return (
    <>
      <PageHero
        title={
          <>
            Our <span className="brand-gradient-text">Team</span>
          </>
        }
        subtitle="Strong leadership and reliable people are at the heart of every G-Unit Security contract."
        breadcrumbs={[{ href: "/", label: "Home" }, { label: "Team" }]}
      />

      <section className="py-24">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-5">
            <SectionLabel>Leadership</SectionLabel>
            <h2 className="font-display text-5xl sm:text-6xl tracking-wider">
              Meet The <span className="brand-gradient-text">Team</span>
            </h2>
            <p className="font-serif italic text-lg text-off-white/70">
              Each member of our leadership brings deep operational experience and a personal
              commitment to client success.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {team.map((member) => {
              const responsibilities = Array.isArray(member.responsibilities)
                ? (member.responsibilities as Responsibility[])
                : [];
              return (
                <article
                  key={member.id}
                  className="bg-navy-rich border border-navy-light hover:border-red-primary/40 rounded-2xl p-7 transition hover:-translate-y-1"
                >
                  <div className="flex items-start gap-4 mb-5">
                    {member.photoUrl ? (
                      <Image
                        src={member.photoUrl}
                        alt={member.name}
                        width={72}
                        height={72}
                        unoptimized
                        className="w-[72px] h-[72px] rounded-full object-cover border border-navy-light"
                      />
                    ) : (
                      <div className="w-[72px] h-[72px] rounded-full bg-gradient-to-br from-red-primary to-blue-primary flex items-center justify-center font-display text-xl tracking-widest flex-shrink-0">
                        {initials(member.name)}
                      </div>
                    )}
                    <div className="min-w-0">
                      <h3 className="font-display text-2xl tracking-wider leading-tight">
                        {member.name}
                      </h3>
                      <p className="text-red-bright text-xs tracking-widest uppercase mt-1.5">
                        {member.role}
                      </p>
                    </div>
                  </div>

                  {member.bio && (
                    <p className="text-gray-mid text-sm leading-relaxed mb-5">{member.bio}</p>
                  )}

                  {responsibilities.length > 0 && (
                    <div className="space-y-2.5 mb-5 pt-5 border-t border-navy-light">
                      {responsibilities.map((r, i) => (
                        <div key={i}>
                          <p className="text-off-white text-xs tracking-widest uppercase">
                            {r.title}
                          </p>
                          {r.description && (
                            <p className="text-gray-mid text-xs mt-0.5">{r.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {(member.email || member.phone) && (
                    <div className="flex flex-wrap gap-3 pt-4 border-t border-navy-light text-xs">
                      {member.email && (
                        <a
                          href={`mailto:${member.email}`}
                          className="inline-flex items-center gap-1.5 text-blue-light hover:text-blue-royal break-all"
                        >
                          <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                          <span className="truncate">{member.email}</span>
                        </a>
                      )}
                      {member.phone && (
                        <a
                          href={`tel:${member.phone.replace(/\s/g, "")}`}
                          className="inline-flex items-center gap-1.5 text-blue-light hover:text-blue-royal"
                        >
                          <Phone className="w-3.5 h-3.5" /> {member.phone}
                        </a>
                      )}
                    </div>
                  )}
                </article>
              );
            })}
          </div>

          {team.length === 0 && (
            <p className="text-center text-gray-mid">
              Team members will appear here once added in the admin panel.
            </p>
          )}
        </div>
      </section>

      <CTASection settings={settings} />
    </>
  );
}
