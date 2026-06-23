"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export type AdoptPetFormValues = {
  name?: string;
  location?: string;
  type?: string;
  gender?: string;
  img?: string;
  tag?: string;
  age?: string;
  breed?: string;
  size?: string;
  medicalStatus?: string;
  summary?: string;
  traits?: string[];
};

const LOCATIONS = ["Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Ras Al Khaimah", "Fujairah"];
const TYPES     = ["Dog", "Cat", "Bird", "Fish", "Other"];
const GENDERS   = ["Male", "Female", "Unknown"];
const SIZES     = ["Small", "Medium", "Large"];

function Submit({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return <Button type="submit" disabled={pending}>{pending ? "Saving…" : label}</Button>;
}

export function AdoptPetForm({
  action,
  initial,
  submitLabel,
}: {
  action: (prev: { error?: string } | undefined, formData: FormData) => Promise<{ error?: string }>;
  initial?: AdoptPetFormValues;
  submitLabel: string;
}) {
  const [state, formAction] = useActionState(action, {});
  const v = initial ?? {};

  return (
    <Card className="max-w-3xl">
      <CardContent className="p-6">
        <form action={formAction} className="space-y-6">
          {/* ── Basic info ── */}
          <div>
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-4">Basic information</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="name">Name *</Label>
                <Input id="name" name="name" defaultValue={v.name ?? ""} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Species</Label>
                <Select name="type" defaultValue={v.type ?? "Dog"}>
                  <SelectTrigger id="type"><SelectValue /></SelectTrigger>
                  <SelectContent>{TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select name="gender" defaultValue={v.gender ?? "Male"}>
                  <SelectTrigger id="gender"><SelectValue /></SelectTrigger>
                  <SelectContent>{GENDERS.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="breed">Breed</Label>
                <Input id="breed" name="breed" defaultValue={v.breed ?? ""} placeholder="e.g. British Shorthair Mix" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="size">Size</Label>
                <Select name="size" defaultValue={v.size ?? ""}>
                  <SelectTrigger id="size"><SelectValue placeholder="Select size" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">—</SelectItem>
                    {SIZES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input id="age" name="age" defaultValue={v.age ?? ""} placeholder="e.g. 2 years" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="medicalStatus">Medical status</Label>
                <Input id="medicalStatus" name="medicalStatus" defaultValue={v.medicalStatus ?? ""} placeholder="e.g. Vaccinated, Neutered" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" name="location" list="loc-options" defaultValue={v.location ?? "Dubai"} />
                <datalist id="loc-options">{LOCATIONS.map((l) => <option key={l} value={l} />)}</datalist>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tag">Status tag</Label>
                <Input id="tag" name="tag" placeholder="Available" defaultValue={v.tag ?? "Available"} />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="img">Image URL *</Label>
                <Input id="img" name="img" type="url" defaultValue={v.img ?? ""} required />
              </div>
            </div>
          </div>

          {/* ── Profile ── */}
          <div>
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-4">Adoption profile</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="summary">Bio / summary</Label>
                <Textarea id="summary" name="summary" rows={3} defaultValue={v.summary ?? ""} placeholder="1–2 sentences about personality and background." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="traits">Traits <span className="text-xs font-normal text-muted-foreground">(comma-separated)</span></Label>
                <Input id="traits" name="traits" defaultValue={(v.traits ?? []).join(", ")} placeholder="e.g. Playful, Litter trained, Indoor preferred" />
              </div>
            </div>
          </div>

          {state?.error && <p className="text-sm text-destructive">{state.error}</p>}

          <div className="flex items-center gap-3 pt-2">
            <Submit label={submitLabel} />
            <Button asChild variant="outline"><Link href="/adopt">Cancel</Link></Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
