"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import type { Industry } from "@prisma/client";
import { Save, CheckCircle } from "lucide-react";
import {
  createIndustry,
  updateIndustry,
  type IndustryFormState,
} from "@/server/actions/industries";
import { FormField, inputClass, textareaClass } from "@/components/admin/FormField";
import { Button } from "@/components/admin/Button";
import { ImageUpload } from "@/components/admin/ImageUpload";

const initialState: IndustryFormState = { ok: false };

export function IndustryForm({ initial }: { initial?: Industry }) {
  const router = useRouter();
  const isEdit = Boolean(initial);
  const action = isEdit ? updateIndustry.bind(null, initial!.id) : createIndustry;

  const [state, formAction, isPending] = useActionState(action, initialState);
  const [imageUrl, setImageUrl] = useState(initial?.imageUrl ?? null);
  const err = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="imageUrl" value={imageUrl ?? ""} />

      <section className="bg-navy-rich border border-navy-light rounded-2xl p-6 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormField label="Title" error={err.title?.[0]}>
            <input name="title" defaultValue={initial?.title ?? ""} className={inputClass} required />
          </FormField>
          <FormField label="Slug" error={err.slug?.[0]} hint="URL path, e.g. local-government">
            <input
              name="slug"
              defaultValue={initial?.slug ?? ""}
              className={`${inputClass} font-mono`}
              required
            />
          </FormField>
        </div>

        <FormField label="Description" error={err.description?.[0]}>
          <textarea
            name="description"
            defaultValue={initial?.description ?? ""}
            className={textareaClass}
            rows={4}
            required
          />
        </FormField>
      </section>

      <section className="bg-navy-rich border border-navy-light rounded-2xl p-6 space-y-5">
        <h2 className="font-display text-xl tracking-wider">Display</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <FormField label="Icon" error={err.icon?.[0]} hint="Lucide icon name">
            <input name="icon" defaultValue={initial?.icon ?? ""} placeholder="Building2" className={inputClass} required />
          </FormField>
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
          folder="industry"
          label="Feature image"
          value={imageUrl}
          onChange={setImageUrl}
        />
      </section>

      <div className="flex items-center gap-4">
        <Button type="submit" disabled={isPending}>
          <Save className="w-3.5 h-3.5" />
          {isPending ? "Saving…" : isEdit ? "Save Changes" : "Create Industry"}
        </Button>
        <button type="button" onClick={() => router.push("/admin/industries")} className="text-gray-mid hover:text-off-white text-sm">
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
