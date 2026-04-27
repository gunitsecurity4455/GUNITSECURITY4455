import { cache } from "react";
import type {
  CoreValue,
  HeroSlide,
  Industry,
  Partner,
  Service,
  SiteSettings,
  TeamMember,
  Testimonial,
} from "@prisma/client";
import { prisma } from "@/lib/prisma";

// All public-site data accessors are wrapped in try/catch so a
// transient DB outage degrades to empty content instead of a 500.
// This also lets the build step succeed when the build env can't
// reach the DB (e.g. our local sandbox without Neon connectivity);
// on Vercel the DB IS reachable so pages prerender with full data.

async function safe<T>(fn: () => Promise<T>, fallback: T, label: string): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    console.warn(`[site-data] ${label} failed:`, err instanceof Error ? err.message : err);
    return fallback;
  }
}

export const getSiteSettings = cache(async (): Promise<SiteSettings | null> =>
  safe(() => prisma.siteSettings.findFirst(), null, "getSiteSettings")
);

export const getPublishedServices = cache(async (): Promise<Service[]> =>
  safe(
    () =>
      prisma.service.findMany({
        where: { published: true },
        orderBy: { order: "asc" },
      }),
    [],
    "getPublishedServices"
  )
);

export const getServiceBySlug = cache(async (slug: string): Promise<Service | null> =>
  safe(
    () =>
      prisma.service.findFirst({
        where: { slug, published: true },
      }),
    null,
    `getServiceBySlug(${slug})`
  )
);

export const getPublishedIndustries = cache(async (): Promise<Industry[]> =>
  safe(
    () =>
      prisma.industry.findMany({
        where: { published: true },
        orderBy: { order: "asc" },
      }),
    [],
    "getPublishedIndustries"
  )
);

export const getPublishedTestimonials = cache(async (): Promise<Testimonial[]> =>
  safe(
    () =>
      prisma.testimonial.findMany({
        where: { published: true },
        orderBy: { order: "asc" },
      }),
    [],
    "getPublishedTestimonials"
  )
);

export const getCoreValues = cache(async (): Promise<CoreValue[]> =>
  safe(
    () =>
      prisma.coreValue.findMany({
        orderBy: { order: "asc" },
      }),
    [],
    "getCoreValues"
  )
);

export const getPublishedHeroSlides = cache(async (): Promise<HeroSlide[]> =>
  safe(
    () =>
      prisma.heroSlide.findMany({
        where: { published: true },
        orderBy: { order: "asc" },
      }),
    [],
    "getPublishedHeroSlides"
  )
);

export const getPartners = cache(async (): Promise<Partner[]> =>
  safe(
    () =>
      prisma.partner.findMany({
        orderBy: { order: "asc" },
      }),
    [],
    "getPartners"
  )
);

export const getActiveTeamMembers = cache(async (): Promise<TeamMember[]> =>
  safe(
    () =>
      prisma.teamMember.findMany({
        where: { isActive: true },
        orderBy: { order: "asc" },
      }),
    [],
    "getActiveTeamMembers"
  )
);
