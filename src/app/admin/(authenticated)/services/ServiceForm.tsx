"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import type { Service } from "@prisma/client";
import { Save, CheckCircle } from "lucide-react";
import {
  createService,
  updateService,
  type ServiceFormState,
} from "@/server/actions/services";
import { FormField, inputClass, textareaClass } from "@/components/admin/FormField";
import { Button } from "@/components/admin/Button";
import { ImageUpload } from "@/components/admin/ImageUpload";

const initialState: ServiceFormState = { ok: false };

export function ServiceForm({ initial }: { initial?: Service }) {
  const router = useRouter();
  const isEdit = Boolean(initial);
  const action = isEdit ? updateService.bind(null, initial!.id) : createService;

  const [state, formAction, isPending] = useActionState(action, initialState);
  const [imageUrl, setImageUrl] = useState(initial?.imageUrl ?? null);
  const err = state.fieldErrors ?? {};

  // `features` is stored as a JSON array of strings — render one per line.
  const initialFeatures = Array.isArray(initial?.features)
    ? (initial.features as string[]).join("\n")
    : "";

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="imageUrl" value={imageUrl ?? ""} />

      <section className="bg-navy-rich border border-navy-light rounded-2xl p-6 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormField label="Title" error={err.title?.[0]}>
            <input
              name="title"
              defaultValue={initial?.title ?? ""}
              className={inputClass}
              required
            />
          </FormField>
          <FormField
            label="Slug"
            error={err.slug?.[0]}
            hint="URL path, e.g. vip-protection"
          >
            <input
              name="slug"
              defaultValue={initial?.slug ?? ""}
              className={`${inputClass} font-mono`}
              required
            />
          </FormField>
        </div>

        <FormField label="Short Description" error={err.shortDesc?.[0]} hint="One sentence, shown in lists">
          <textarea
            name="shortDesc"
            defaultValue={initial?.shortDesc ?? ""}
            className={textareaClass}
            rows={2}
            required
          />
        </FormField>

        <FormField label="Long Description" error={err.longDesc?.[0]}>
          <textarea
            name="longDesc"
            defaultValue={initial?.longDesc ?? ""}
            className={textareaClass}
            rows={6}
            required
          />
        </FormField>

        <FormField
          label="Features"
          error={err.features?.[0]}
          hint="One bullet per line — e.g. Site supervisors, Control room operators"
        >
          <textarea
            name="features"
            defaultValue={initialFeatures}
            className={textareaClass}
            rows={6}
            placeholder={"Site supervisors\nControl room operators\nRover patrol officers"}
          />
        </FormField>
      </section>

      <section className="bg-navy-rich border border-navy-light rounded-2xl p-6 space-y-5">
        <h2 className="font-display text-xl tracking-wider">Display</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <FormField label="Icon" error={err.icon?.[0]} hint="Lucide icon name">
            <input
              name="icon"
              defaultValue={initial?.icon ?? ""}
              placeholder="Shield"
              className={inputClass}
              required
            />
          </FormField>
          <FormField label="Order" error={err.order?.[0]}>
            <input
              type="number"
              name="order"
              defaultValue={initial?.order ?? 0}
              className={inputClass}
            />
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
          folder="service"
          label="Feature image"
          value={imageUrl}
          onChange={setImageUrl}
        />
      </section>

      <div className="flex items-center gap-4">
        <Button type="submit" disabled={isPending}>
          <Save className="w-3.5 h-3.5" />
          {isPending ? "Saving…" : isEdit ? "Save Changes" : "Create Service"}
        </Button>
        <button
          type="button"
          onClick={() => router.push("/admin/services")}
          className="text-gray-mid hover:text-off-white text-sm"
        >
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
