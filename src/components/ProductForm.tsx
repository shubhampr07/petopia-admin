"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export type ProductFormValues = {
  name?: string;
  brand?: string | null;
  category?: string | null;
  pet?: string;
  vibe?: string | null;
  price?: string;
  oldPrice?: string | null;
  badge?: string | null;
  tag?: string | null;
  img?: string;
  isBestseller?: boolean;
  isNewArrival?: boolean;
  detailDescription?: string | null;
  detailHighlights?: string[] | null;
};

const PETS = ["All", "Dog", "Cat", "Bird", "Fish"];
const VIBES = [
  { value: "none", label: "None" },
  { value: "high-energy", label: "High Energy" },
  { value: "chill-mode", label: "Chill Mode" },
];

function Submit({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Saving…" : label}
    </Button>
  );
}

export function ProductForm({
  action,
  initial,
  brands,
  categories,
  submitLabel,
}: {
  action: (prev: { error?: string } | undefined, formData: FormData) => Promise<{ error?: string }>;
  initial?: ProductFormValues;
  brands: string[];
  categories: string[];
  submitLabel: string;
}) {
  const [state, formAction] = useActionState(action, {});
  const v = initial ?? {};

  return (
    <Card className="max-w-3xl">
      <CardContent className="p-4 sm:p-6">
        <form action={formAction} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="name">Name *</Label>
              <Input id="name" name="name" defaultValue={v.name ?? ""} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="brand">Brand</Label>
              <Input id="brand" name="brand" list="brand-options" defaultValue={v.brand ?? ""} />
              <datalist id="brand-options">
                {brands.map((b) => <option key={b} value={b} />)}
              </datalist>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input id="category" name="category" list="cat-options" defaultValue={v.category ?? ""} />
              <datalist id="cat-options">
                {categories.map((c) => <option key={c} value={c} />)}
              </datalist>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pet">Pet</Label>
              <Select name="pet" defaultValue={v.pet ?? "All"}>
                <SelectTrigger id="pet">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PETS.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="vibe">Vibe collection</Label>
              <Select name="vibe" defaultValue={v.vibe ?? "none"}>
                <SelectTrigger id="vibe">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {VIBES.map((vb) => <SelectItem key={vb.value} value={vb.value}>{vb.label}</SelectItem>)}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">Shows on the storefront&apos;s &ldquo;Shop by Vibe&rdquo;.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price (AED) *</Label>
              <Input id="price" name="price" type="number" step="0.01" min="0" defaultValue={v.price ?? ""} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="oldPrice">Old price (AED)</Label>
              <Input id="oldPrice" name="oldPrice" type="number" step="0.01" min="0" defaultValue={v.oldPrice ?? ""} />
              <p className="text-xs text-muted-foreground">Shown struck-through for discounts.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="badge">Badge</Label>
              <Input id="badge" name="badge" placeholder="Sale, New, -17%…" defaultValue={v.badge ?? ""} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tag">Tag</Label>
              <Input id="tag" name="tag" placeholder="hot, offer, Sold Out…" defaultValue={v.tag ?? ""} />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="img">Image URL *</Label>
              <Input id="img" name="img" type="url" defaultValue={v.img ?? ""} required />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="detailDescription">Description</Label>
              <Textarea id="detailDescription" name="detailDescription" rows={3} defaultValue={v.detailDescription ?? ""} />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="detailHighlights">Highlights (one per line)</Label>
              <Textarea
                id="detailHighlights"
                name="detailHighlights"
                rows={3}
                placeholder={"Balanced adult formula\nVet-trusted brand"}
                defaultValue={(v.detailHighlights ?? []).join("\n")}
              />
            </div>

            <div className="flex items-center gap-6 sm:col-span-2">
              <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                <Checkbox name="isBestseller" defaultChecked={v.isBestseller} />
                Bestseller
              </label>
              <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                <Checkbox name="isNewArrival" defaultChecked={v.isNewArrival} />
                New arrival
              </label>
            </div>
          </div>

          {state?.error && <p className="text-sm text-destructive">{state.error}</p>}

          <div className="flex items-center gap-3 pt-2">
            <Submit label={submitLabel} />
            <Button asChild variant="outline">
              <Link href="/products">Cancel</Link>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
