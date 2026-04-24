import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // 1. Default admin user — idempotent upsert
  const adminEmail = process.env.DEFAULT_ADMIN_EMAIL ?? "admin@gunitsecurity.com.au";
  const adminPassword = process.env.DEFAULT_ADMIN_PASSWORD ?? "ChangeMe123!";
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      passwordHash,
      name: "Admin",
      role: "ADMIN",
    },
  });

  // 2. Site settings — single row
  const existingSettings = await prisma.siteSettings.findFirst();
  if (!existingSettings) {
    await prisma.siteSettings.create({
      data: {
        companyName: "G Unit Security",
        tagline: "Perth's Premier Security Services",
        phone: "+61 426 842 606",
        email: "info@gunitsecurity.com.au",
        address: "PO BOX 254, Mirrabooka, WA 6941",
        hours: "24/7 Emergency Response | Office Mon–Fri 9AM–6PM",
      },
    });
  }

  // 3. Services (8)
  const services = [
    {
      slug: "vip-protection",
      title: "VIP Protection",
      shortDesc: "Discreet, elite protection for high-profile individuals. Officers double as drivers and personal aides with total confidentiality.",
      longDesc:
        "Our VIP Protection service delivers elite close protection for high-profile individuals, executives, celebrities, and dignitaries. Every officer is rigorously trained in threat assessment, defensive driving, and close-quarter protection. We operate with total discretion — officers blend seamlessly into your environment while maintaining complete situational awareness. 100% confidentiality is guaranteed.",
      icon: "Shield",
      order: 1,
    },
    {
      slug: "crowd-control",
      title: "Crowd Control",
      shortDesc: "Events from 50 to 30,000 patrons. Distinctly uniformed, fully-insured professionals monitoring patron behaviour.",
      longDesc:
        "From intimate private events to stadium-scale concerts, our Crowd Control teams manage gatherings of up to 30,000 patrons. Our distinctly uniformed, fully-licensed officers monitor patron behaviour, enforce entry controls, manage queues, and coordinate emergency response. We work closely with event organisers, venue managers, and WA Police to deliver safe, well-managed events.",
      icon: "Users",
      order: 2,
    },
    {
      slug: "cctv-monitoring",
      title: "CCTV Monitoring",
      shortDesc: "Complete installation, monitoring, and servicing. Electronic surveillance that deters threats and responds in real time.",
      longDesc:
        "End-to-end CCTV solutions — from site assessment and installation to 24/7 remote monitoring and ongoing servicing. Our systems use HD and 4K cameras, night vision, motion analytics, and real-time alerts. Our monitoring centre operates round-the-clock, reviewing footage, flagging incidents, and dispatching mobile patrols when threats are detected.",
      icon: "Camera",
      order: 3,
    },
    {
      slug: "mobile-patrols",
      title: "Mobile Patrols",
      shortDesc: "High-visibility patrols protecting property and assets. Alarm response, lock-up checks, and emergency services coordination.",
      longDesc:
        "Our Mobile Patrol units provide high-visibility deterrence across Perth and surrounding suburbs. Services include random property patrols, alarm response, lock-up and open-up checks, vacant property inspections, and coordination with WA Police during emergencies. Each patrol vehicle is GPS-tracked with full digital reporting for every visit.",
      icon: "Car",
      order: 4,
    },
    {
      slug: "financial-escorts",
      title: "Financial Escorts",
      shortDesc: "Secure transport for currency, documents, and valuables. High-visibility presence deterring threats during transit.",
      longDesc:
        "Secure armed and unarmed escort services for cash-in-transit, sensitive documents, jewellery, and high-value assets. Our escort teams plan routes, coordinate with financial institutions, and use high-visibility uniforms and marked vehicles to deter threats. Full insurance coverage on all escorts.",
      icon: "Banknote",
      order: 5,
    },
    {
      slug: "canine-security",
      title: "Canine Security",
      shortDesc: "Trained security dogs with handlers providing exceptional deterrence. Effective for large areas and high-risk environments.",
      longDesc:
        "Highly trained patrol and detection dogs paired with certified handlers. Ideal for warehouse complexes, construction sites, large event perimeters, and high-risk environments where a single officer cannot cover the area alone. Our canine teams provide unmatched deterrence and detection capability.",
      icon: "Dog",
      order: 6,
    },
    {
      slug: "concierge-services",
      title: "Concierge Services",
      shortDesc: "Professional concierge security for residential, hospitality, and corporate environments. Ensuring smooth operations and guest safety.",
      longDesc:
        "Premium concierge security blends hospitality with safety. Our concierge officers manage reception duties, access control, visitor vetting, package handling, and incident response in residential towers, hotels, resorts, and corporate lobbies. Presented in sharp formal attire, they uphold a polished first impression while maintaining comprehensive security oversight.",
      icon: "Bell",
      order: 7,
    },
    {
      slug: "security-guards",
      title: "Security Guards",
      shortDesc: "Distinctly uniformed security personnel protecting property, assets, and people. The highest standards in guard services.",
      longDesc:
        "Fully-licensed static and roving security guards for retail, commercial, industrial, and residential sites. Every guard is background-checked, first-aid trained, and experienced in incident reporting, de-escalation, and emergency procedures. Options for armed and unarmed details available.",
      icon: "UserCheck",
      order: 8,
    },
  ];

  for (const service of services) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: {},
      create: service,
    });
  }

  // 4. Industries (4)
  const industries = [
    {
      slug: "local-government",
      title: "Local Government",
      description:
        "Proudly partnering with WA's local governments and councils to keep communities, public spaces, municipal buildings, and infrastructure safe.",
      icon: "Landmark",
      order: 1,
    },
    {
      slug: "events",
      title: "Events",
      description:
        "Tailored venue and event security with the highest standards and a smart workforce using smart technology. From small private gatherings to stadium shows.",
      icon: "Ticket",
      order: 2,
    },
    {
      slug: "commercial",
      title: "Commercial Properties",
      description:
        "State-of-the-art protection for office towers, retail precincts, warehouses, and training facilities — 24/7, including full concierge services.",
      icon: "Building2",
      order: 3,
    },
    {
      slug: "hotels",
      title: "Hotels",
      description:
        "The chosen security service for over 100 of Perth's premier hospitality venues. Blending hospitality standards with vigilant protection.",
      icon: "Hotel",
      order: 4,
    },
  ];

  for (const industry of industries) {
    await prisma.industry.upsert({
      where: { slug: industry.slug },
      update: {},
      create: industry,
    });
  }

  // 5. Testimonials (5)
  const testimonials = [
    {
      name: "Mark Reynolds",
      role: "Operations Manager",
      quote:
        "G Unit Security were outstanding from start to finish. Their team was professional, calm, and highly reliable. We felt completely secure throughout our event.",
      rating: 5,
      order: 1,
    },
    {
      name: "Sarah Collins",
      role: "Property Manager",
      quote:
        "We engaged G Unit Security for our retail premises and have been extremely impressed with their vigilance and reporting. Their presence has made a real difference.",
      rating: 5,
      order: 2,
    },
    {
      name: "Emily Harper",
      role: "Events & Hospitality Director",
      quote:
        "Exceptional professionalism and discretion. G Unit Security handled our requirements flawlessly and exceeded expectations in every way.",
      rating: 5,
      order: 3,
    },
    {
      name: "Aman Singh",
      role: "Producer",
      company: "YS Production",
      quote:
        "Reliable, responsive, and professional. The crowd management at our shows has been seamless — the team knows exactly how to handle any situation.",
      rating: 5,
      order: 4,
    },
    {
      name: "Daniel Thompson",
      role: "Construction Project Lead",
      quote:
        "Our site has been secured flawlessly through a large build-out. Mobile patrols, alarm response, and lock-up checks all handled without a single issue.",
      rating: 5,
      order: 5,
    },
  ];

  for (const testimonial of testimonials) {
    const existing = await prisma.testimonial.findFirst({
      where: { name: testimonial.name, role: testimonial.role },
    });
    if (!existing) {
      await prisma.testimonial.create({ data: testimonial });
    }
  }

  // 6. Core Values (6)
  const coreValues = [
    {
      title: "Customer-Centric",
      description: "Your project's success is our priority. We tailor every engagement to your unique needs and requirements.",
      icon: "Heart",
      order: 1,
    },
    {
      title: "Data-Centric",
      description: "Informed decisions based on analytics, threat assessment, and continuous performance measurement.",
      icon: "BarChart3",
      order: 2,
    },
    {
      title: "Relationship-Centric",
      description: "Strong, long-term partnerships built on trust, transparency, and mutual respect with every client.",
      icon: "HandshakeIcon",
      order: 3,
    },
    {
      title: "Policy-Centric",
      description: "Strict adherence to industry regulations, compliance standards, and internal policies for safe operations.",
      icon: "FileCheck",
      order: 4,
    },
    {
      title: "Employee-Centric",
      description: "Investing in our team through continuous training, fair compensation, and career development opportunities.",
      icon: "Users",
      order: 5,
    },
    {
      title: "Solution-Centric",
      description: "Innovative approaches to complex security challenges. We don't just identify problems — we solve them.",
      icon: "Lightbulb",
      order: 6,
    },
  ];

  for (const value of coreValues) {
    const existing = await prisma.coreValue.findFirst({ where: { title: value.title } });
    if (!existing) {
      await prisma.coreValue.create({ data: value });
    }
  }

  // 7. Hero slides (3)
  const heroSlides = [
    {
      headline: "Protecting What Matters Most",
      subheadline: "Perth's Premier Security Partner — Licensed, Insured, Trusted Since 2010.",
      ctaText: "Request Free Quote",
      ctaLink: "/contact",
      order: 1,
    },
    {
      headline: "Elite Security, Uncompromising Standards",
      subheadline: "From VIP protection to large-scale crowd control, we deliver safety with the highest professionalism.",
      ctaText: "Explore Services",
      ctaLink: "/services",
      order: 2,
    },
    {
      headline: "24/7 Response Ready",
      subheadline: "Rapid mobile patrols, alarm response, and live CCTV monitoring across Perth and surrounds.",
      ctaText: "Call +61 426 842 606",
      ctaLink: "tel:+61426842606",
      order: 3,
    },
  ];

  for (const slide of heroSlides) {
    const existing = await prisma.heroSlide.findFirst({ where: { headline: slide.headline } });
    if (!existing) {
      await prisma.heroSlide.create({ data: slide });
    }
  }

  // 8. Partners / trust badges (6)
  const partners = [
    { name: "WA Licensed", order: 1 },
    { name: "SAIWA Member", order: 2 },
    { name: "ASIAL Accredited", order: 3 },
    { name: "$20M Insured", order: 4 },
    { name: "24/7 Response", order: 5 },
    { name: "Police Liaison", order: 6 },
  ];

  for (const partner of partners) {
    const existing = await prisma.partner.findFirst({ where: { name: partner.name } });
    if (!existing) {
      await prisma.partner.create({ data: partner });
    }
  }

  console.log("Seed complete.");
  console.log(`Admin login: ${adminEmail} / (from DEFAULT_ADMIN_PASSWORD)`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
