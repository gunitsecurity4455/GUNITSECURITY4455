"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import type { TeamMember } from "@prisma/client";
import { Save, CheckCircle } from "lucide-react";
import {
  createTeamMember,
  updateTeamMember,
  type TeamMemberFormState,
} from "@/server/actions/team-members";
import { FormField, inputClass, textareaClass } from "@/components/admin/FormField";
import { Button } from "@/components/admin/Button";
import { ImageUpload } from "@/components/admin/ImageUpload";

const initialState: TeamMemberFormState = { ok: false };

type ResponsibilityShape = { title?: string; description?: string };

function responsibilitiesToText(value: TeamMember["responsibilities"]): string {
  if (!Array.isArray(value)) return "";
  return (value as ResponsibilityShape[])
    .map((r) =>
      r?.description ? `${r.title ?? ""} — ${r.description}` : (r?.title ?? "")
    )
    .filter(Boolean)
    .join("\n");
}

export function TeamMemberForm({ initial }: { initial?: TeamMember }) {
  const router = useRouter();
  const isEdit = Boolean(initial);
  const action = isEdit ? updateTeamMember.bind(null, initial!.id) : createTeamMember;

  const [state, formAction, isPending] = useActionState(action, initialState);
  const [photoUrl, setPhotoUrl] = useState(initial?.photoUrl ?? null);
  const err = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="photoUrl" value={photoUrl ?? ""} />

      <section className="bg-navy-rich border border-navy-light rounded-2xl p-6 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormField label="Name" error={err.name?.[0]}>
            <input name="name" defaultValue={initial?.name ?? ""} className={inputClass} required />
          </FormField>
          <FormField label="Role" error={err.role?.[0]}>
            <input name="role" defaultValue={initial?.role ?? ""} className={inputClass} required />
          </FormField>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormField label="Email" error={err.email?.[0]} hint="Optional">
            <input
              type="email"
              name="email"
              defaultValue={initial?.email ?? ""}
              className={inputClass}
            />
          </FormField>
          <FormField label="Phone" error={err.phone?.[0]} hint="Optional">
            <input name="phone" defaultValue={initial?.phone ?? ""} className={inputClass} />
          </FormField>
        </div>

        <FormField label="Bio" error={err.bio?.[0]}>
          <textarea
            name="bio"
            defaultValue={initial?.bio ?? ""}
            className={textareaClass}
            rows={3}
          />
        </FormField>

        <FormField
          label="Responsibilities"
          error={err.responsibilities?.[0]}
          hint='One per line, format: "Title — short description"'
        >
          <textarea
            name="responsibilities"
            defaultValue={responsibilitiesToText(initial?.responsibilities ?? null)}
            className={textareaClass}
            rows={5}
            placeholder={
              "Strategic Leadership — Driving growth and long-term value.\nClient Focused — Building strong partnerships."
            }
          />
        </FormField>
      </section>

      <section className="bg-navy-rich border border-navy-light rounded-2xl p-6 space-y-5">
        <h2 className="font-display text-xl tracking-wider">Display</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                name="isActive"
                defaultChecked={initial?.isActive ?? true}
                className="w-4 h-4 accent-red-bright"
              />
              <span className="text-sm">Active (shown on public site)</span>
            </label>
          </FormField>
        </div>

        <ImageUpload folder="team" label="Photo" value={photoUrl} onChange={setPhotoUrl} />
      </section>

      <div className="flex items-center gap-4">
        <Button type="submit" disabled={isPending}>
          <Save className="w-3.5 h-3.5" />
          {isPending ? "Saving…" : isEdit ? "Save Changes" : "Create Team Member"}
        </Button>
        <button
          type="button"
          onClick={() => router.push("/admin/team-members")}
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
