import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle } from "lucide-react";
import { getCoreValues, getSiteSettings } from "@/lib/site-data";
import { resolveIcon } from "@/lib/icons";
import { PageHero } from "@/components/shared/PageHero";
import { SectionLabel } from "@/components/shared/SectionLabel";
import { CTASection } from "@/components/home/CTASection";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "G-Unit Security — privately owned Western Australian security firm focused on operational reliability, strong supervision, and quality recruitment.",
};

export const revalidate = 600;

const stats = [
  { value: "Since 2024", label: "Established WA" },
  { value: "8", label: "Specialised Services" },
  { value: "24/7", label: "Communication" },
  { value: "100%", label: "Licensed Officers" },
];

const operatingFactors = [
  {
    title: "Right Personnel Selection",
    description:
      "Quality recruitment with rigorous screening — licence verification, experience review, and reference checks. We match the right officer to the right environment.",
  },
  {
    title: "Strong Operational Procedures",
    description:
      "Clear expectations, structured rosters, well-documented site procedures, and consistent service delivery across every contract.",
  },
  {
    title: "Active Management Supervision",
    description:
      "Supervisor visits, performance reviews, and procedure compliance checks ensure operational excellence is maintained day in, day out.",
  },
];

const recruitmentPillars = [
  "Licensed and verified",
  "Experienced & professional",
  "Customer-service focused",
  "Reliable and accountable",
];

const transitionSteps = [
  {
    title: "Listen & Assess",
    description: "Understand the existing pain points and the outcomes you're looking for.",
  },
  {
    title: "Plan & Roster",
    description:
      "Build a transition plan with the right personnel, structured rosters, and documented site procedures.",
  },
  {
    title: "Onboard & Train",
    description:
      "Site walk-throughs, briefings, and procedure handover so officers hit the ground knowing the role.",
  },
  {
    title: "Supervise & Improve",
    description:
      "Active supervision, daily comms, and continuous improvement reviews to keep service high.",
  },
];

export default async function AboutPage() {
  const [values, settings] = await Promise.all([getCoreValues(), getSiteSettings()]);

  return (
    <>
      <PageHero
        title={
          <>
            About <span className="brand-gradient-text">Us</span>
          </>
        }
        subtitle="Built on integrity, driven by structure — discover the people and approach behind G-Unit Security."
        breadcrumbs={[{ href: "/", label: "Home" }, { label: "About" }]}
      />

      <section className="py-24">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8 grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative aspect-square rounded-2xl overflow-hidden border border-navy-light bg-navy-rich flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-br from-red-primary/20 via-transparent to-blue-primary/20" />
            <div className="absolute inset-0 grid-bg opacity-60" />
            <div className="relative text-center">
              <p className="font-display text-[120px] leading-none brand-gradient-text tracking-wider">
                Since
              </p>
              <p className="font-display text-[180px] leading-none brand-gradient-text tracking-wider">
                2024
              </p>
              <p className="text-xs tracking-[5px] text-off-white/70 uppercase mt-4">
                Western Australia
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <SectionLabel>Our Story</SectionLabel>
            <h2 className="font-display text-5xl sm:text-6xl tracking-wider">
              Your Security, <span className="brand-gradient-text">Our Mission</span>
            </h2>
            <p className="text-gray-mid leading-relaxed">
              {settings?.description ??
                "G-Unit Security is a privately owned Western Australian company focused on delivering dependable, professional, and structured security solutions across Perth and its environs."}
            </p>
            <p className="text-gray-mid leading-relaxed">
              We prioritise operational reliability over uncontrolled growth — the right officer
              on the right site, supported by structured procedures and active supervision. That
              focus is why our clients choose us and stay with us.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-red-primary to-red-deep hover:from-red-bright hover:to-red-primary text-white text-xs tracking-[3px] uppercase font-medium px-7 py-3.5 rounded-lg transition shadow-[0_15px_40px_-15px_rgba(200,16,46,0.5)]"
            >
              Get In Touch
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-24 bg-navy-rich/40 grid-bg">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-5">
            <SectionLabel>Operating Philosophy</SectionLabel>
            <h2 className="font-display text-5xl sm:text-6xl tracking-wider">
              Three <span className="brand-gradient-text">Operating</span> Factors
            </h2>
            <p className="font-serif italic text-lg text-off-white/70">
              Every contract we run rests on the same three principles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {operatingFactors.map((factor, i) => (
              <div
                key={factor.title}
                className="bg-navy-rich border border-navy-light rounded-2xl p-7"
              >
                <p className="font-display text-4xl text-off-white/15 mb-3 tracking-wider">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="font-display text-2xl tracking-wider mb-3">{factor.title}</h3>
                <p className="text-gray-mid text-sm leading-relaxed">{factor.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8 grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <SectionLabel>Recruitment & Personnel</SectionLabel>
            <h2 className="font-display text-5xl tracking-wider">
              Right People. <span className="brand-gradient-text">Right Sites.</span>
            </h2>
            <p className="text-gray-mid leading-relaxed">
              Our personnel selection process is rigorous because the officer on the ground is the
              service. We screen for licence, experience, presentation, customer service, and
              reliability — and match those qualities to each site&apos;s environment.
            </p>
            <ul className="space-y-3">
              {recruitmentPillars.map((p) => (
                <li key={p} className="flex items-center gap-3 text-off-white/85 text-sm">
                  <span className="w-7 h-7 rounded-lg bg-red-primary/15 border border-red-primary/30 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-3.5 h-3.5 text-red-bright" />
                  </span>
                  {p}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-5">
            <h3 className="font-display text-3xl tracking-wider">
              Contract Transition Approach
            </h3>
            <p className="text-gray-mid text-sm leading-relaxed">
              Switching providers shouldn&apos;t mean disruption. Our four-step transition framework
              keeps continuity intact while we take over the contract.
            </p>
            <div className="space-y-3">
              {transitionSteps.map((step, i) => (
                <div
                  key={step.title}
                  className="bg-navy-rich border border-navy-light rounded-xl p-5"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-primary to-blue-primary flex items-center justify-center font-display text-sm flex-shrink-0">
                      {i + 1}
                    </div>
                    <div>
                      <h4 className="font-display text-lg tracking-wider">{step.title}</h4>
                      <p className="text-gray-mid text-xs mt-1 leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-navy-rich/40 grid-bg">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-5">
            <SectionLabel>What We Stand For</SectionLabel>
            <h2 className="font-display text-5xl sm:text-6xl tracking-wider">
              Our <span className="brand-gradient-text">Commitments</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {values.map((value) => {
              const Icon = resolveIcon(value.icon);
              return (
                <div
                  key={value.id}
                  className="bg-navy-rich border border-navy-light hover:border-red-primary/40 rounded-2xl p-7 transition hover:-translate-y-1"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-primary/20 to-blue-primary/20 flex items-center justify-center mb-5 border border-navy-light">
                    <Icon className="w-5 h-5 text-red-bright" />
                  </div>
                  <h3 className="font-display text-2xl tracking-wider mb-3">{value.title}</h3>
                  <p className="text-gray-mid text-sm leading-relaxed">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
          <div className="text-center mb-12 space-y-4">
            <SectionLabel>By The Numbers</SectionLabel>
            <h2 className="font-display text-5xl tracking-wider">
              Built On <span className="brand-gradient-text">Structure</span>
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-navy-rich border border-navy-light rounded-2xl p-8 text-center"
              >
                <p className="font-display text-4xl brand-gradient-text tracking-wider">
                  {stat.value}
                </p>
                <p className="text-xs tracking-[3px] text-gray-mid mt-2 uppercase">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection settings={settings} />
    </>
  );
}
