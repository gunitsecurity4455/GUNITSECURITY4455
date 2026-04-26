"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import type { Partner } from "@prisma/client";
import { Save, CheckCircle } from "lucide-react";
import {
  createPartner,
  updatePartner,
  type PartnerFormState,
} from "@/server/actions/partners";
import { FormField, inputClass } from "@/components/admin/FormField";
import { Button } from "@/components/admin/Button";
import { ImageUpload } from "@/components/admin/ImageUpload";

const initialState: PartnerFormState = { ok: false };

export function PartnerForm({ initial }: { initial?: Partner }) {
  const router = useRouter();
  const isEdit = Boolean(initial);
  const action = isEdit ? updatePartner.bind(null, initial!.id) : createPartner;

  const [state, formAction, isPending] = useActionState(action, initialState);
  const [logoUrl, setLogoUrl] = useState(initial?.logoUrl ?? null);
  const err = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="logoUrl" value={logoUrl ?? ""} />

      <section className="bg-navy-rich border border-navy-light rounded-2xl p-6 space-y-5">
        <FormField label="Name" error={err.name?.[0]}>
          <input name="name" defaultValue={initial?.name ?? ""} className={inputClass} required />
        </FormField>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormField label="Website" error={err.website?.[0]} hint="Optional">
            <input
              name="website"
              defaultValue={initial?.website ?? ""}
              className={inputClass}
              placeholder="https://example.com"
            />
          </FormField>
          <FormField label="Order" error={err.order?.[0]}>
            <input type="number" name="order" defaultValue={initial?.order ?? 0} className={inputClass} />
          </FormField>
        </div>
        <ImageUpload folder="partner" label="Logo" value={logoUrl} onChange={setLogoUrl} />
      </section>

      <div className="flex items-center gap-4">
        <Button type="submit" disabled={isPending}>
          <Save className="w-3.5 h-3.5" />
          {isPending ? "Saving…" : isEdit ? "Save Changes" : "Create Partner"}
        </Button>
        <button type="button" onClick={() => router.push("/admin/partners")} className="text-gray-mid hover:text-off-white text-sm">
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
