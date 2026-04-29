"use client";

import { useActionState, useState } from "react";
import type { SiteSettings } from "@prisma/client";
import { Save, CheckCircle } from "lucide-react";
import { updateSettings, type SettingsFormState } from "@/server/actions/settings";
import { FormField, inputClass, textareaClass } from "@/components/admin/FormField";
import { Button } from "@/components/admin/Button";
import { ImageUpload } from "@/components/admin/ImageUpload";

const initialState: SettingsFormState = { ok: false };

export function SettingsForm({ initial }: { initial: SiteSettings | null }) {
  const [state, formAction, isPending] = useActionState(updateSettings, initialState);
  const [logoUrl, setLogoUrl] = useState(initial?.logoUrl ?? null);
  const [logoHeight, setLogoHeight] = useState(initial?.logoHeight ?? 48);
  const err = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="logoUrl" value={logoUrl ?? ""} />

      <section className="bg-navy-rich border border-navy-light rounded-2xl p-6 space-y-5">
        <h2 className="font-display text-xl tracking-wider">Brand</h2>
        <ImageUpload
          folder="logo"
          label="Site Logo"
          value={logoUrl}
          onChange={setLogoUrl}
          recommendedSize="400×400"
          recommendedDimensions="1:1 square (transparent PNG)"
          maxSizeMB={1}
        />

        <input type="hidden" name="logoHeight" value={logoHeight} />
        <FormField
          label={`Logo display height: ${logoHeight}px`}
          error={err.logoHeight?.[0]}
          hint="How tall the logo renders in the navbar + footer. 48px is balanced; bump to 64–80px for a bolder mark."
        >
          <input
            type="range"
            min={24}
            max={120}
            step={2}
            value={logoHeight}
            onChange={(e) => setLogoHeight(Number(e.target.value))}
            className="w-full accent-red-bright"
          />
        </FormField>

        {logoUrl && (
          <div className="bg-navy-deep border border-navy-light rounded-lg p-5">
            <p className="text-[10px] tracking-[3px] uppercase text-gray-mid mb-3">
              Live Preview
            </p>
            <div className="bg-pure-black border border-white/8 rounded-lg p-4 flex items-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logoUrl}
                alt="Preview"
                style={{ height: `${logoHeight}px` }}
                className="w-auto object-contain"
              />
            </div>
          </div>
        )}
      </section>

      <section className="bg-navy-rich border border-navy-light rounded-2xl p-6 space-y-5">
        <h2 className="font-display text-xl tracking-wider">Company</h2>
        <FormField label="Company Name" error={err.companyName?.[0]}>
          <input
            name="companyName"
            defaultValue={initial?.companyName ?? "G-Unit Security"}
            className={inputClass}
            required
          />
        </FormField>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormField label="Tagline" error={err.tagline?.[0]} hint='e.g. "Your Security, Our Mission"'>
            <input name="tagline" defaultValue={initial?.tagline ?? ""} className={inputClass} />
          </FormField>
          <FormField
            label="Subtitle"
            error={err.subtitle?.[0]}
            hint={`e.g. "We Don't Mind 24/7 Communication"`}
          >
            <input name="subtitle" defaultValue={initial?.subtitle ?? ""} className={inputClass} />
          </FormField>
        </div>
        <FormField label="Description" error={err.description?.[0]} hint="Short paragraph used on About / footer">
          <textarea
            name="description"
            defaultValue={initial?.description ?? ""}
            className={textareaClass}
            rows={3}
          />
        </FormField>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <FormField label="Established" error={err.established?.[0]} hint='e.g. "2024"'>
            <input name="established" defaultValue={initial?.established ?? ""} className={inputClass} />
          </FormField>
          <FormField label="Region" error={err.region?.[0]} hint='e.g. "Western Australia"'>
            <input name="region" defaultValue={initial?.region ?? ""} className={inputClass} />
          </FormField>
          <FormField label="Website" error={err.website?.[0]}>
            <input name="website" defaultValue={initial?.website ?? ""} className={inputClass} placeholder="www.gunitsecurity.com.au" />
          </FormField>
        </div>
      </section>

      <section className="bg-navy-rich border border-navy-light rounded-2xl p-6 space-y-5">
        <h2 className="font-display text-xl tracking-wider">Contact</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormField label="Phone" error={err.phone?.[0]}>
            <input name="phone" defaultValue={initial?.phone ?? ""} className={inputClass} required />
          </FormField>
          <FormField label="Primary Email" error={err.email?.[0]} hint="Director / leadership inbox">
            <input
              type="email"
              name="email"
              defaultValue={initial?.email ?? ""}
              className={inputClass}
              required
            />
          </FormField>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormField label="General Email" error={err.generalEmail?.[0]} hint="e.g. info@…">
            <input
              type="email"
              name="generalEmail"
              defaultValue={initial?.generalEmail ?? ""}
              className={inputClass}
            />
          </FormField>
          <FormField label="Emergency Response" error={err.emergencyResponse?.[0]} hint='e.g. "24/7"'>
            <input
              name="emergencyResponse"
              defaultValue={initial?.emergencyResponse ?? ""}
              className={inputClass}
            />
          </FormField>
        </div>
        <FormField
          label="Google Maps Link"
          error={err.mapEmbedUrl?.[0]}
          hint="Paste a Google Maps share or embed URL — used as the office map on /contact. Leave blank to fall back to the address auto-embed."
        >
          <input
            name="mapEmbedUrl"
            defaultValue={initial?.mapEmbedUrl ?? ""}
            className={inputClass}
            placeholder="https://www.google.com/maps/place/…  or  https://maps.app.goo.gl/…"
          />
        </FormField>
        <FormField label="Address" error={err.address?.[0]}>
          <textarea
            name="address"
            defaultValue={initial?.address ?? ""}
            className={textareaClass}
            required
          />
        </FormField>
        <FormField label="Hours" error={err.hours?.[0]}>
          <input name="hours" defaultValue={initial?.hours ?? ""} className={inputClass} />
        </FormField>
      </section>

      <section className="bg-navy-rich border border-navy-light rounded-2xl p-6 space-y-5">
        <h2 className="font-display text-xl tracking-wider">Social</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormField label="Facebook URL" error={err.facebookUrl?.[0]}>
            <input
              name="facebookUrl"
              defaultValue={initial?.facebookUrl ?? ""}
              className={inputClass}
              placeholder="https://facebook.com/…"
            />
          </FormField>
          <FormField label="Instagram URL" error={err.instagramUrl?.[0]}>
            <input
              name="instagramUrl"
              defaultValue={initial?.instagramUrl ?? ""}
              className={inputClass}
            />
          </FormField>
          <FormField label="LinkedIn URL" error={err.linkedinUrl?.[0]}>
            <input
              name="linkedinUrl"
              defaultValue={initial?.linkedinUrl ?? ""}
              className={inputClass}
            />
          </FormField>
          <FormField label="Twitter URL" error={err.twitterUrl?.[0]}>
            <input
              name="twitterUrl"
              defaultValue={initial?.twitterUrl ?? ""}
              className={inputClass}
            />
          </FormField>
        </div>
      </section>

      <section className="bg-navy-rich border border-navy-light rounded-2xl p-6 space-y-5">
        <h2 className="font-display text-xl tracking-wider">Client Logos Marquee</h2>
        <p className="text-xs text-gray-mid -mt-2">
          Controls the scrolling client logos strip on the homepage.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormField
            label="Speed (seconds per loop)"
            error={err.marqueeSpeed?.[0]}
            hint="Lower = faster. 40 is a calm default."
          >
            <input
              type="number"
              name="marqueeSpeed"
              min={10}
              max={120}
              defaultValue={initial?.marqueeSpeed ?? 40}
              className={inputClass}
            />
          </FormField>
          <FormField label="Direction" error={err.marqueeDirection?.[0]}>
            <select
              name="marqueeDirection"
              defaultValue={initial?.marqueeDirection ?? "left"}
              className={inputClass}
            >
              <option value="left">← Left</option>
              <option value="right">Right →</option>
            </select>
          </FormField>
          <FormField label="Default logo width (px)" error={err.logoMaxWidth?.[0]}>
            <input
              type="number"
              name="logoMaxWidth"
              min={40}
              max={400}
              defaultValue={initial?.logoMaxWidth ?? 150}
              className={inputClass}
            />
          </FormField>
          <FormField label="Default logo height (px)" error={err.logoMaxHeight?.[0]}>
            <input
              type="number"
              name="logoMaxHeight"
              min={20}
              max={200}
              defaultValue={initial?.logoMaxHeight ?? 80}
              className={inputClass}
            />
          </FormField>
        </div>
        <FormField label="Pause on hover">
          <label className="flex items-center gap-2 h-[42px]">
            <input
              type="checkbox"
              name="marqueePauseOnHover"
              defaultChecked={initial?.marqueePauseOnHover ?? true}
              className="w-4 h-4 accent-red-bright"
            />
            <span className="text-sm">Stop scrolling when the user hovers over a logo</span>
          </label>
        </FormField>
      </section>

      <div className="flex items-center gap-4">
        <Button type="submit" disabled={isPending}>
          <Save className="w-3.5 h-3.5" />
          {isPending ? "Saving…" : "Save Settings"}
        </Button>
        {state.ok && (
          <span className="flex items-center gap-1.5 text-green-400 text-sm">
            <CheckCircle className="w-4 h-4" /> {state.message}
          </span>
        )}
        {!state.ok && state.message && (
          <span className="text-red-bright text-sm">{state.message}</span>
        )}
      </div>
    </form>
  );
}
