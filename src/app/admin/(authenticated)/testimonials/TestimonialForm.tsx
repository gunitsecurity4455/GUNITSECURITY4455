"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import type { Testimonial } from "@prisma/client";
import { Save, CheckCircle } from "lucide-react";
import {
  createTestimonial,
  updateTestimonial,
  type TestimonialFormState,
} from "@/server/actions/testimonials";
import { FormField, inputClass, textareaClass } from "@/components/admin/FormField";
import { Button } from "@/components/admin/Button";
import { ImageUpload } from "@/components/admin/ImageUpload";

const initialState: TestimonialFormState = { ok: false };

export function TestimonialForm({ initial }: { initial?: Testimonial }) {
  const router = useRouter();
  const isEdit = Boolean(initial);
  const action = isEdit ? updateTestimonial.bind(null, initial!.id) : createTestimonial;

  const [state, formAction, isPending] = useActionState(action, initialState);
  const [avatarUrl, setAvatarUrl] = useState(initial?.avatarUrl ?? null);
  const err = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="avatarUrl" value={avatarUrl ?? ""} />

      <section className="bg-navy-rich border border-navy-light rounded-2xl p-6 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormField label="Name" error={err.name?.[0]}>
            <input name="name" defaultValue={initial?.name ?? ""} className={inputClass} required />
          </FormField>
          <FormField label="Role" error={err.role?.[0]}>
            <input name="role" defaultValue={initial?.role ?? ""} className={inputClass} required />
          </FormField>
        </div>
        <FormField label="Company" error={err.company?.[0]} hint="Optional">
          <input name="company" defaultValue={initial?.company ?? ""} className={inputClass} />
        </FormField>
        <FormField label="Quote" error={err.quote?.[0]}>
          <textarea
            name="quote"
            defaultValue={initial?.quote ?? ""}
            className={textareaClass}
            rows={4}
            required
          />
        </FormField>
      </section>

      <section className="bg-navy-rich border border-navy-light rounded-2xl p-6 space-y-5">
        <h2 className="font-display text-xl tracking-wider">Display</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <FormField label="Rating (1-5)" error={err.rating?.[0]}>
            <input
              type="number"
              name="rating"
              min={1}
              max={5}
              defaultValue={initial?.rating ?? 5}
              className={inputClass}
            />
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
          folder="testimonial"
          label="Avatar"
          value={avatarUrl}
          onChange={setAvatarUrl}
        />
      </section>

      <div className="flex items-center gap-4">
        <Button type="submit" disabled={isPending}>
          <Save className="w-3.5 h-3.5" />
          {isPending ? "Saving…" : isEdit ? "Save Changes" : "Create Testimonial"}
        </Button>
        <button type="button" onClick={() => router.push("/admin/testimonials")} className="text-gray-mid hover:text-off-white text-sm">
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
