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
import { Checkbox } from "@/components/ui/checkbox";
import type { BookingService } from "@/lib/api";

export type BookingServiceFormValues = Partial<Omit<BookingService, "createdAt" | "updatedAt">>;

const CATEGORIES = ["Grooming packages", "Training programs"];

function Submit({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return <Button type="submit" disabled={pending}>{pending ? "Saving…" : label}</Button>;
}

export function BookingServiceForm({
  action,
  initial,
  submitLabel,
}: {
  action: (prev: { error?: string } | undefined, formData: FormData) => Promise<{ error?: string }>;
  initial?: BookingServiceFormValues;
  submitLabel: string;
}) {
  const [state, formAction] = useActionState(action, {});
  const v = initial ?? {};

  return (
    <Card className="max-w-3xl">
      <CardContent className="p-6">
        <form action={formAction} className="space-y-6">
          {/* ── Core ── */}
          <div>
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-4">Service details</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="name">Name *</Label>
                <Input id="name" name="name" defaultValue={v.name ?? ""} required placeholder="e.g. Full Groom" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select name="category" defaultValue={v.category ?? "Grooming packages"}>
                  <SelectTrigger id="category"><SelectValue /></SelectTrigger>
                  <SelectContent>{CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="durationMin">Duration (min)</Label>
                <Input id="durationMin" name="durationMin" type="number" min={5} defaultValue={v.durationMin ?? 60} />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="includes">Description / includes</Label>
                <Textarea id="includes" name="includes" rows={2} defaultValue={v.includes ?? ""} placeholder="What's included in this service…" />
              </div>
            </div>
          </div>

          {/* ── Pricing ── */}
          <div>
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-4">Pricing (AED)</h3>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="price">Base price *</Label>
                <Input id="price" name="price" type="number" min={0} step="0.01" defaultValue={v.price ?? 0} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pricingSmall">Small pet</Label>
                <Input id="pricingSmall" name="pricingSmall" type="number" min={0} step="0.01" defaultValue={v.pricingSmall ?? ""} placeholder="—" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pricingMedium">Medium pet</Label>
                <Input id="pricingMedium" name="pricingMedium" type="number" min={0} step="0.01" defaultValue={v.pricingMedium ?? ""} placeholder="—" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pricingLarge">Large pet</Label>
                <Input id="pricingLarge" name="pricingLarge" type="number" min={0} step="0.01" defaultValue={v.pricingLarge ?? ""} placeholder="—" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Leave Small / Medium / Large blank for flat-rate services.</p>
          </div>

          {/* ── Training specific ── */}
          <div>
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-4">Training program details</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="sessions">Sessions label</Label>
                <Input id="sessions" name="sessions" defaultValue={v.sessions ?? ""} placeholder="e.g. 8 × 1 hr sessions" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="locationNote">Location note</Label>
                <Input id="locationNote" name="locationNote" defaultValue={v.locationNote ?? ""} placeholder="e.g. In-home only" />
              </div>
            </div>
          </div>

          {/* ── Visibility ── */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="sortOrder">Sort order</Label>
              <Input id="sortOrder" name="sortOrder" type="number" min={0} defaultValue={v.sortOrder ?? 0} />
            </div>
            <div className="flex items-center gap-3 pt-7">
              <Checkbox id="isActive" name="isActive" value="true" defaultChecked={v.isActive !== false} />
              <Label htmlFor="isActive">Active (shown in booking wizard)</Label>
            </div>
          </div>

          {state?.error && <p className="text-sm text-destructive">{state.error}</p>}

          <div className="flex items-center gap-3 pt-2">
            <Submit label={submitLabel} />
            <Button asChild variant="outline"><Link href="/services">Cancel</Link></Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
