"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import type { HeroSlide } from "@prisma/client";
import { Save, CheckCircle } from "lucide-react";
import {
  createHeroSlide,
  updateHeroSlide,
  type HeroSlideFormState,
} from "@/server/actions/hero-slides";
import { FormField, inputClass, textareaClass } from "@/components/admin/FormField";
import { Button } from "@/components/admin/Button";
import { ImageUpload } from "@/components/admin/ImageUpload";

const initialState: HeroSlideFormState = { ok: false };

export function HeroSlideForm({ initial }: { initial?: HeroSlide }) {
  const router = useRouter();
  const isEdit = Boolean(initial);
  const action = isEdit ? updateHeroSlide.bind(null, initial!.id) : createHeroSlide;

  const [state, formAction, isPending] = useActionState(action, initialState);
  const [imageUrl, setImageUrl] = useState(initial?.imageUrl ?? null);
  const err = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="imageUrl" value={imageUrl ?? ""} />

      <section className="bg-navy-rich border border-navy-light rounded-2xl p-6 space-y-5">
        <FormField label="Headline" error={err.headline?.[0]}>
          <input name="headline" defaultValue={initial?.headline ?? ""} className={inputClass} required />
        </FormField>
        <FormField label="Subheadline" error={err.subheadline?.[0]}>
          <textarea
            name="subheadline"
            defaultValue={initial?.subheadline ?? ""}
            className={textareaClass}
            rows={2}
            required
          />
        </FormField>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormField label="CTA Text" error={err.ctaText?.[0]} hint="Optional, e.g. Request a Quote">
            <input name="ctaText" defaultValue={initial?.ctaText ?? ""} className={inputClass} />
          </FormField>
          <FormField label="CTA Link" error={err.ctaLink?.[0]} hint="Optional, e.g. /contact">
            <input name="ctaLink" defaultValue={initial?.ctaLink ?? ""} className={inputClass} />
          </FormField>
        </div>
      </section>

      <section className="bg-navy-rich border border-navy-light rounded-2xl p-6 space-y-5">
        <h2 className="font-display text-xl tracking-wider">Display</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormField label="Order" error={err.order?.[0]}>
            <input type="number" name="order" defaultValue={initial?.order ?? 0} className={inputClass} />
          </FormField>
          <FormField label="Status">
            <label className="flex items-center gap-2 h-[42px]">
              <input
                type="checkbox"
                name="published"
                defaultChecked={initial?.published ?? true}
                className="w-4 h-4 accent-red-bright"
              />
              <span className="text-sm">Published</span>
            </label>
          </FormField>
        </div>
        <ImageUpload
          folder="hero"
          label="Background image"
          value={imageUrl}
          onChange={setImageUrl}
        />
      </section>

      <div className="flex items-center gap-4">
        <Button type="submit" disabled={isPending}>
          <Save className="w-3.5 h-3.5" />
          {isPending ? "Saving…" : isEdit ? "Save Changes" : "Create Slide"}
        </Button>
        <button type="button" onClick={() => router.push("/admin/hero-slides")} className="text-gray-mid hover:text-off-white text-sm">
          Cancel
        </button>
        {state.ok && isEdit && (
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
