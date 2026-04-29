"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-helpers";

const schema = z.object({
  companyName: z.string().min(1),
  tagline: z.string().optional(),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  logoUrl: z.string().optional(),
  logoHeight: z.coerce.number().int().min(24).max(120).default(48),
  phone: z.string().min(1),
  email: z.string().email(),
  generalEmail: z.string().email().or(z.literal("")).optional(),
  address: z.string().min(1),
  hours: z.string().optional(),
  website: z.string().optional(),
  established: z.string().optional(),
  region: z.string().optional(),
  emergencyResponse: z.string().optional(),
  mapEmbedUrl: z.string().optional(),
  facebookUrl: z.string().url().or(z.literal("")).optional(),
  instagramUrl: z.string().url().or(z.literal("")).optional(),
  linkedinUrl: z.string().url().or(z.literal("")).optional(),
  twitterUrl: z.string().url().or(z.literal("")).optional(),
  marqueeSpeed: z.coerce.number().int().min(10).max(120).default(40),
  marqueeDirection: z.enum(["left", "right"]).default("left"),
  marqueePauseOnHover: z.coerce.boolean().default(true),
  logoMaxWidth: z.coerce.number().int().min(40).max(400).default(150),
  logoMaxHeight: z.coerce.number().int().min(20).max(200).default(80),
});

export type SettingsFormState = {
  ok: boolean;
  message?: string;
  fieldErrors?: Record<string, string[]>;
};

function nullIfEmpty(v: FormDataEntryValue | null): string | null {
  const s = typeof v === "string" ? v.trim() : "";
  return s === "" ? null : s;
}

export async function updateSettings(
  _prev: SettingsFormState,
  formData: FormData
): Promise<SettingsFormState> {
  await requireAdmin();

  const parsed = schema.safeParse({
    companyName: formData.get("companyName"),
    tagline: formData.get("tagline") ?? undefined,
    subtitle: formData.get("subtitle") ?? undefined,
    description: formData.get("description") ?? undefined,
    logoUrl: formData.get("logoUrl") ?? undefined,
    logoHeight: formData.get("logoHeight") ?? 48,
    phone: formData.get("phone"),
    email: formData.get("email"),
    generalEmail: formData.get("generalEmail") ?? undefined,
    address: formData.get("address"),
    hours: formData.get("hours") ?? undefined,
    website: formData.get("website") ?? undefined,
    established: formData.get("established") ?? undefined,
    region: formData.get("region") ?? undefined,
    emergencyResponse: formData.get("emergencyResponse") ?? undefined,
    mapEmbedUrl: formData.get("mapEmbedUrl") ?? undefined,
    facebookUrl: formData.get("facebookUrl") ?? undefined,
    instagramUrl: formData.get("instagramUrl") ?? undefined,
    linkedinUrl: formData.get("linkedinUrl") ?? undefined,
    twitterUrl: formData.get("twitterUrl") ?? undefined,
    marqueeSpeed: formData.get("marqueeSpeed") ?? 40,
    marqueeDirection: formData.get("marqueeDirection") ?? "left",
    marqueePauseOnHover: formData.get("marqueePauseOnHover") === "on",
    logoMaxWidth: formData.get("logoMaxWidth") ?? 150,
    logoMaxHeight: formData.get("logoMaxHeight") ?? 80,
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: "Please fix the errors below.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const data = {
    companyName: parsed.data.companyName,
    tagline: nullIfEmpty(formData.get("tagline")),
    subtitle: nullIfEmpty(formData.get("subtitle")),
    description: nullIfEmpty(formData.get("description")),
    logoUrl: nullIfEmpty(formData.get("logoUrl")),
    logoHeight: parsed.data.logoHeight,
    phone: parsed.data.phone,
    email: parsed.data.email,
    generalEmail: nullIfEmpty(formData.get("generalEmail")),
    address: parsed.data.address,
    hours: nullIfEmpty(formData.get("hours")),
    website: nullIfEmpty(formData.get("website")),
    established: nullIfEmpty(formData.get("established")),
    region: nullIfEmpty(formData.get("region")),
    emergencyResponse: nullIfEmpty(formData.get("emergencyResponse")),
    mapEmbedUrl: nullIfEmpty(formData.get("mapEmbedUrl")),
    facebookUrl: nullIfEmpty(formData.get("facebookUrl")),
    instagramUrl: nullIfEmpty(formData.get("instagramUrl")),
    linkedinUrl: nullIfEmpty(formData.get("linkedinUrl")),
    twitterUrl: nullIfEmpty(formData.get("twitterUrl")),
    marqueeSpeed: parsed.data.marqueeSpeed,
    marqueeDirection: parsed.data.marqueeDirection,
    marqueePauseOnHover: parsed.data.marqueePauseOnHover,
    logoMaxWidth: parsed.data.logoMaxWidth,
    logoMaxHeight: parsed.data.logoMaxHeight,
  };

  const existing = await prisma.siteSettings.findFirst();
  if (existing) {
    await prisma.siteSettings.update({ where: { id: existing.id }, data });
  } else {
    await prisma.siteSettings.create({ data });
  }

  revalidatePath("/admin/settings");
  revalidatePath("/", "layout");
  return { ok: true, message: "Settings saved." };
}
