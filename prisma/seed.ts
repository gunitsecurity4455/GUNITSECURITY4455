import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // ─────────────────────────────────────────────────────────────────
  // 1. Default admin user
  // ─────────────────────────────────────────────────────────────────
  // We overwrite the password hash on every seed so changing
  // DEFAULT_ADMIN_PASSWORD in Vercel env vars actually takes effect on
  // redeploy. Trade-off: until there's an in-app password-change page,
  // a deploy will overwrite any manual hash change.
  const adminEmail = process.env.DEFAULT_ADMIN_EMAIL ?? "admin@gunitsecurity.com.au";
  const adminPassword = process.env.DEFAULT_ADMIN_PASSWORD ?? "ChangeMe123!";
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { passwordHash },
    create: {
      email: adminEmail,
      passwordHash,
      name: "Admin",
      role: "ADMIN",
    },
  });

  // ─────────────────────────────────────────────────────────────────
  // 2. Site settings (single row — upsert by first existing id)
  // ─────────────────────────────────────────────────────────────────
  const settingsData = {
    companyName: "G-Unit Security",
    tagline: "Your Security, Our Mission",
    subtitle: "We Don't Mind 24/7 Communication",
    description:
      "G-Unit Security is a privately owned Western Australian company focused on delivering dependable, professional, and structured security solutions across Perth and its environs.",
    phone: "0490 331 894",
    email: "dario.m@gunitsecurity.com.au",
    generalEmail: "info@gunitsecurity.com.au",
    address: "36 Brisbane Street, Perth WA 6000",
    hours: "24/7 Emergency Response",
    website: "www.gunitsecurity.com.au",
    established: "2024",
    region: "Western Australia",
    emergencyResponse: "24/7",
  };
  const existingSettings = await prisma.siteSettings.findFirst();
  if (existingSettings) {
    await prisma.siteSettings.update({ where: { id: existingSettings.id }, data: settingsData });
  } else {
    await prisma.siteSettings.create({ data: settingsData });
  }

  // ─────────────────────────────────────────────────────────────────
  // 3. Services (8) — idempotent: only seed when the table is empty,
  //    so admin edits and uploaded image URLs aren't wiped on redeploy.
  // ─────────────────────────────────────────────────────────────────
  if ((await prisma.service.count()) === 0) {
  const services = [
    {
      slug: "commercial-guarding",
      title: "Commercial Guarding",
      shortDesc:
        "Professional security personnel for corporate buildings, ensuring first-class customer service and high behavioural standards.",
      longDesc:
        "In corporate settings, security personnel are often the first contact for tenants, contractors, and visitors. Officers must demonstrate strong communication, professional presentation, and customer service skills.",
      icon: "Building2",
      order: 1,
      features: [
        "Site supervisors",
        "Control room operators",
        "Rover patrol officers",
        "Concierge security officers",
        "Loading dock controllers",
        "Mailroom security support",
        "Access control officers",
      ],
    },
    {
      slug: "healthcare-security",
      title: "Healthcare Security",
      shortDesc:
        "Specialised security for healthcare facilities — calm communication, empathy, and patient safety.",
      longDesc:
        "Healthcare facilities require officers who balance security with professionalism, empathy, and clear communication. Our personnel work in sensitive environments while maintaining safety for patients, staff, and visitors.",
      icon: "HeartPulse",
      order: 2,
      features: [
        "Calm communication",
        "Professional behaviour",
        "Situational awareness",
        "Patient escort services",
        "Access control",
        "Infrastructure checks",
        "Loading dock control",
      ],
    },
    {
      slug: "retail-warehousing-logistics",
      title: "Retail, Warehousing & Logistics",
      shortDesc:
        "Strict procedural compliance with strong customer awareness for retail and logistics environments.",
      longDesc:
        "Retail and logistics environments demand strict procedural compliance. Officers maintain efficiency while ensuring security compliance within time-sensitive logistics operations.",
      icon: "Warehouse",
      order: 3,
      features: [
        "Site supervisors",
        "Gatehouse officers",
        "Security system monitoring",
        "Key holding",
        "Perimeter patrols",
        "Visitor checks",
        "Alarm response",
        "Dispatch verification",
        "Loss prevention officers",
        "Car park patrol officers",
      ],
    },
    {
      slug: "construction-site-security",
      title: "Construction Site Security",
      shortDesc:
        "Reduce theft risk, prevent unauthorised access, maintain site control on high-value construction sites.",
      longDesc:
        "Construction sites are high-risk due to valuable equipment and open access. Our services are designed to reduce theft risk, prevent unauthorised access, and maintain site control.",
      icon: "HardHat",
      order: 4,
      features: [
        "Static guarding",
        "Mobile patrols",
        "Access control",
        "Visitor verification",
        "Vehicle entry control",
        "Welfare checks",
        "After-hours monitoring",
      ],
    },
    {
      slug: "crowd-control-event-security",
      title: "Crowd Control & Event Security",
      shortDesc:
        "Licensed crowd control officers managing events with a customer-focused approach.",
      longDesc:
        "We offer licensed crowd control officers trained to manage environments professionally with a customer-focused approach. Support for licensed venues, corporate functions, private and community events.",
      icon: "Users",
      order: 5,
      features: [
        "Licensed venues",
        "Corporate functions",
        "Private events",
        "Community events",
        "Emergency event coverage",
        "Risk prevention",
        "Professional engagement",
        "Incident management",
        "Safe crowd movement",
      ],
    },
    {
      slug: "mobile-patrols-alarm-response",
      title: "Mobile Patrols & Alarm Response",
      shortDesc:
        "Flexible, cost-effective security solution for sites outside operational hours.",
      longDesc:
        "Mobile patrols offer a flexible, cost-effective solution for site security outside operational hours. Tailored to client risk exposure with structured reporting for accountability.",
      icon: "Car",
      order: 6,
      features: [
        "Lock and unlock services",
        "Infrastructure checks",
        "Perimeter inspections",
        "Hazard identification",
        "Welfare checks",
        "Incident reporting",
      ],
    },
    {
      slug: "cctv-monitoring-support",
      title: "CCTV Monitoring Support",
      shortDesc:
        "Technology-supported security with real-time monitoring and rapid response coordination.",
      longDesc:
        "Modern security operations rely on technology-supported service delivery. Our CCTV monitoring support provides incident reporting, workforce coordination, and service accountability.",
      icon: "Camera",
      order: 7,
      features: [
        "Real-time monitoring",
        "Incident reporting",
        "Communication tracking",
        "Service accountability",
        "Digital reporting",
        "Operational communication",
      ],
    },
    {
      slug: "vip-asset-protection",
      title: "VIP & Asset Protection",
      shortDesc: "Discreet, professional protection for high-value individuals and assets.",
      longDesc:
        "Specialised VIP protection and asset security services with risk assessment and discreet professional officers.",
      icon: "Shield",
      order: 8,
      features: [
        "Discreet protection",
        "Asset transit security",
        "Risk assessment",
        "Personal security details",
        "Event protection",
        "24/7 availability",
      ],
    },
  ];
    for (const s of services) {
      await prisma.service.create({ data: s });
    }
  }

  // ─────────────────────────────────────────────────────────────────
  // 4. Industries (6) — idempotent
  // ─────────────────────────────────────────────────────────────────
  if ((await prisma.industry.count()) === 0) {
  const industries = [
    {
      slug: "commercial-corporate",
      title: "Commercial & Corporate Buildings",
      description:
        "Site supervisors, concierge, and access control for offices and corporate facilities.",
      icon: "Building",
      order: 1,
    },
    {
      slug: "healthcare",
      title: "Healthcare Facilities",
      description: "Empathetic, calm security officers for hospitals and medical centres.",
      icon: "HeartPulse",
      order: 2,
    },
    {
      slug: "retail-logistics",
      title: "Retail & Logistics",
      description: "Loss prevention, warehouse security, and dispatch verification.",
      icon: "ShoppingBag",
      order: 3,
    },
    {
      slug: "construction",
      title: "Construction Sites",
      description: "Theft prevention, access control, and after-hours monitoring.",
      icon: "HardHat",
      order: 4,
    },
    {
      slug: "events-venues",
      title: "Licensed Venues & Events",
      description: "Crowd control, corporate functions, and emergency event coverage.",
      icon: "Users",
      order: 5,
    },
    {
      slug: "mobile-patrols",
      title: "Mobile Patrol Areas",
      description: "Flexible patrol services across Perth metropolitan and regional WA.",
      icon: "Car",
      order: 6,
    },
  ];
    for (const i of industries) {
      await prisma.industry.create({ data: i });
    }
  }

  // ─────────────────────────────────────────────────────────────────
  // 5. Core values (7) — idempotent
  // ─────────────────────────────────────────────────────────────────
  if ((await prisma.coreValue.count()) === 0) {
  const coreValues = [
    {
      title: "Right Personnel Selection",
      description:
        "Quality recruitment with rigorous screening — licence, experience, professionalism, and reliability.",
      icon: "UserCheck",
      order: 1,
    },
    {
      title: "Strong Operational Procedures",
      description:
        "Clear expectations, structured rosters, and consistent service delivery across all sites.",
      icon: "ClipboardCheck",
      order: 2,
    },
    {
      title: "Active Management Supervision",
      description:
        "Supervisor visits, performance reviews, and procedure compliance checks ensure operational excellence.",
      icon: "Eye",
      order: 3,
    },
    {
      title: "Strong Supervision",
      description: "We maintain consistent supervisory presence across all contracts.",
      icon: "Shield",
      order: 4,
    },
    {
      title: "Quick Response",
      description: "Rapid issue resolution and 24/7 communication availability.",
      icon: "Zap",
      order: 5,
    },
    {
      title: "Open Communication",
      description: "Transparent reporting, daily updates, and proactive client communication.",
      icon: "MessageCircle",
      order: 6,
    },
    {
      title: "Continuous Improvement",
      description:
        "We continuously develop systems, processes, and people to deliver better service.",
      icon: "TrendingUp",
      order: 7,
    },
  ];
    for (const v of coreValues) {
      await prisma.coreValue.create({ data: v });
    }
  }

  // ─────────────────────────────────────────────────────────────────
  // 6. Hero slides (3) — idempotent (preserves admin-uploaded images)
  // ─────────────────────────────────────────────────────────────────
  if ((await prisma.heroSlide.count()) === 0) {
  const heroSlides = [
    {
      headline: "Your Security, Our Mission",
      subheadline:
        "Privately owned Western Australian company delivering reliable security solutions across Perth and surrounds.",
      ctaText: "Get Free Consultation",
      ctaLink: "/contact",
      order: 1,
    },
    {
      headline: "We Don't Mind 24/7 Communication",
      subheadline: "Always available, always responsive — round-the-clock support and rapid response when you need us most.",
      ctaText: "Contact Us",
      ctaLink: "/contact",
      order: 2,
    },
    {
      headline: "Strong Management. Reliable Officers.",
      subheadline:
        "Since 2024, we prioritise operational reliability and active supervision over uncontrolled growth.",
      ctaText: "Our Approach",
      ctaLink: "/about",
      order: 3,
    },
  ];
    for (const h of heroSlides) {
      await prisma.heroSlide.create({ data: h });
    }
  }

  // ─────────────────────────────────────────────────────────────────
  // 7. Partners / clients (6) — idempotent (preserves logos)
  // ─────────────────────────────────────────────────────────────────
  if ((await prisma.partner.count()) === 0) {
  const partners = [
    { name: "Perth Motorplex", category: "Client Portfolio", order: 1 },
    { name: "Mazzucchelli's", category: "Client Portfolio", order: 2 },
    { name: "Savills", category: "Client Portfolio", order: 3 },
    { name: "Zamel's", category: "Client Portfolio", order: 4 },
    { name: "Ashtar (WA)", category: "Trusts We Won", order: 5 },
    { name: "Luxus (WA)", category: "Trusts We Won", order: 6 },
  ];
    for (const p of partners) {
      await prisma.partner.create({ data: p });
    }
  }

  // ─────────────────────────────────────────────────────────────────
  // 8. Team members (5) — idempotent (preserves photos)
  // ─────────────────────────────────────────────────────────────────
  if ((await prisma.teamMember.count()) === 0) {
  const team = [
    {
      name: "Dario Markonja",
      role: "Director",
      email: "dario.m@gunitsecurity.com.au",
      bio:
        "As Director of G-Unit Security, Dario leads the organisation with a clear focus on integrity, client satisfaction, and operational excellence.",
      responsibilities: [
        { title: "Strategic Leadership", description: "Driving growth, performance and long-term value." },
        { title: "Client Focused", description: "Building strong partnerships through trust and reliability." },
        { title: "Operational Excellence", description: "Ensuring high standards across all services and sites." },
      ],
      order: 1,
    },
    {
      name: "Ali Shehzad",
      role: "Business Development Director",
      email: "ali.s@gunitsecurity.com.au",
      bio:
        "Ali is responsible for business development, client relationships, and identifying opportunities that drive sustainable growth.",
      responsibilities: [
        { title: "Business Growth", description: "Identifying new opportunities and expanding client base." },
        { title: "Relationship Building", description: "Fostering long-term partnerships built on trust." },
        { title: "Market Insight", description: "Understanding client needs and delivering tailored solutions." },
      ],
      order: 2,
    },
    {
      name: "Hardik Walia (Hardy)",
      role: "Business Development Manager / Scheduling Coordinator",
      email: "h.walia@gunitsecurity.com.au",
      phone: "0490 331 894",
      bio:
        "Building strong client relationships and streamlined scheduling to deliver security solutions that you can rely on.",
      responsibilities: [
        { title: "Client Relationships", description: "Building and nurturing strong partnerships through trust and effective communication." },
        { title: "Scheduling Excellence", description: "Coordinating plans and resources to ensure seamless operations and client satisfaction." },
        { title: "Operational Efficiency", description: "Streamlining processes to improve productivity and service delivery." },
      ],
      order: 3,
    },
    {
      name: "Mandy",
      role: "Operations Manager",
      email: "mandy.s@gunitsecurity.com.au",
      bio:
        "Mandy ensures the smooth delivery of security services through strong supervision, planning, and operational control. She is also the primary point of contact for client services and relationship management.",
      responsibilities: [
        { title: "Operations Oversight", description: "Managing day-to-day operations for efficiency and quality." },
        { title: "Team Leadership", description: "Leading and mentoring teams to deliver high performance." },
        { title: "Client Services", description: "Primary point of contact for clients and ongoing relationship management." },
      ],
      order: 4,
    },
    {
      name: "Aman Pahwa",
      role: "Rostering Manager",
      email: "amy.p@gunitsecurity.com.au",
      bio:
        "Aman manages workforce scheduling and rostering to ensure the right people are in the right place at the right time.",
      responsibilities: [
        { title: "Workforce Planning", description: "Efficient rostering that ensures coverage and continuity." },
        { title: "Schedule Optimisation", description: "Maximising resources while meeting client needs." },
        { title: "Compliance Focus", description: "Ensuring all rosters meet legal and company requirements." },
      ],
      order: 5,
    },
  ];
    for (const m of team) {
      await prisma.teamMember.create({ data: m });
    }
  }

  // ─────────────────────────────────────────────────────────────────
  // 9. Testimonials — keep existing seed data (idempotent)
  // ─────────────────────────────────────────────────────────────────
  const testimonials = [
    {
      name: "Mark Reynolds",
      role: "Operations Manager",
      quote:
        "G-Unit Security were outstanding from start to finish. Their team was professional, calm, and highly reliable. We felt completely secure throughout our event.",
      rating: 5,
      order: 1,
    },
    {
      name: "Sarah Collins",
      role: "Property Manager",
      quote:
        "We engaged G-Unit Security for our retail premises and have been extremely impressed with their vigilance and reporting. Their presence has made a real difference.",
      rating: 5,
      order: 2,
    },
    {
      name: "Emily Harper",
      role: "Events & Hospitality Director",
      quote:
        "Exceptional professionalism and discretion. G-Unit Security handled our requirements flawlessly and exceeded expectations in every way.",
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

  // ─────────────────────────────────────────────────────────────────
  // 10. One-time data migrations
  // ─────────────────────────────────────────────────────────────────
  // The first round of seed data didn't match the latest brief: Mandeep
  // and Mandy are the same person (use Mandy), and Ali is the Event
  // Manager (not Business Development). These migrations run on every
  // deploy but are idempotent — once the data is in the new shape, the
  // findFirst lookups return nothing and the updates skip.
  // Importantly, they preserve any photoUrl an admin uploaded.

  // Drop the standalone "Mandy" stub row if it still exists.
  const mandyStub = await prisma.teamMember.findFirst({
    where: { name: "Mandy", role: "Client Services Manager" },
  });
  if (mandyStub) {
    await prisma.teamMember.delete({ where: { id: mandyStub.id } });
  }

  // Merge Mandeep Sehrawat into Mandy (keeps photoUrl, just changes
  // name/role/bio/responsibilities).
  const mandeepRow = await prisma.teamMember.findFirst({
    where: { name: "Mandeep Sehrawat" },
  });
  if (mandeepRow) {
    await prisma.teamMember.update({
      where: { id: mandeepRow.id },
      data: {
        name: "Mandy",
        role: "Operations Manager",
        email: "mandy.s@gunitsecurity.com.au",
        bio:
          "Mandy ensures the smooth delivery of security services through strong supervision, planning, and operational control. She is also the primary point of contact for client services and relationship management.",
        responsibilities: [
          { title: "Operations Oversight", description: "Managing day-to-day operations for efficiency and quality." },
          { title: "Team Leadership", description: "Leading and mentoring teams to deliver high performance." },
          { title: "Client Services", description: "Primary point of contact for clients and ongoing relationship management." },
        ],
      },
    });
  }

  // Revert Ali Shehzad's role to the original PDF capability statement copy:
  // Business Development Director (he was briefly seeded as Event Manager;
  // the brief now confirms the original title).
  const aliRow = await prisma.teamMember.findFirst({
    where: { name: "Ali Shehzad", role: "Event Manager" },
  });
  if (aliRow) {
    await prisma.teamMember.update({
      where: { id: aliRow.id },
      data: {
        role: "Business Development Director",
        bio:
          "Ali is responsible for business development, client relationships, and identifying opportunities that drive sustainable growth.",
        responsibilities: [
          { title: "Business Growth", description: "Identifying new opportunities and expanding client base." },
          { title: "Relationship Building", description: "Fostering long-term partnerships built on trust." },
          { title: "Market Insight", description: "Understanding client needs and delivering tailored solutions." },
        ],
      },
    });
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
