import type { Metadata } from "next";
import { Shield, GraduationCap, TrendingUp, Heart } from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";
import { SectionLabel } from "@/components/shared/SectionLabel";
import { ApplicationForm } from "@/components/forms/ApplicationForm";

export const revalidate = 600;

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Join G Unit Security — Perth's premier security firm. Licensed, insured, and looking for disciplined professionals to join our ranks.",
};

const benefits = [
  {
    icon: Shield,
    title: "Licensed & Insured",
    description: "Work for a fully licensed firm with $20M insurance — backed every shift.",
  },
  {
    icon: GraduationCap,
    title: "Continuous Training",
    description: "Ongoing development in tactics, technology, de-escalation, and first aid.",
  },
  {
    icon: TrendingUp,
    title: "Career Growth",
    description: "Clear pathways from officer to team lead, operations, and specialised roles.",
  },
  {
    icon: Heart,
    title: "Culture of Respect",
    description: "A professional, supportive team that values integrity and accountability.",
  },
];

export default function CareerPage() {
  return (
    <>
      <PageHero
        title={
          <>
            Join Our <span className="brand-gradient-text">Ranks</span>
          </>
        }
        subtitle="We hire disciplined, licensed, customer-first professionals who take pride in protecting what matters."
        breadcrumbs={[{ href: "/", label: "Home" }, { label: "Careers" }]}
      />

      <section className="py-24 bg-navy-rich/40">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-5">
            <SectionLabel>Why G Unit</SectionLabel>
            <h2 className="font-display text-5xl tracking-wider">
              Build a Career <span className="brand-gradient-text">That Matters</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {benefits.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="bg-navy-rich border border-navy-light hover:border-red-primary/40 rounded-2xl p-6 transition hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-primary/20 to-blue-primary/20 flex items-center justify-center mb-5 border border-navy-light">
                  <Icon className="w-5 h-5 text-red-bright" />
                </div>
                <h3 className="font-display text-xl tracking-wider mb-2">{title}</h3>
                <p className="text-gray-mid text-sm leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <div className="bg-navy-rich border border-navy-light rounded-2xl p-8 md:p-10">
            <h2 className="font-display text-4xl tracking-wider mb-2">Apply Now</h2>
            <p className="text-gray-mid text-sm mb-8">
              Tell us about yourself. We review every application personally and respond within one
              business week.
            </p>
            <ApplicationForm />
          </div>
        </div>
      </section>
    </>
  );
}
