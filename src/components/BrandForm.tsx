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

export type BrandFormValues = {
  name?: string;
  slug?: string;
  logo?: string | null;
  description?: string | null;
  featured?: boolean;
};

function Submit({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Saving…" : label}
    </Button>
  );
}

export function BrandForm({
  action,
  initial,
  submitLabel,
}: {
  action: (prev: { error?: string } | undefined, formData: FormData) => Promise<{ error?: string }>;
  initial?: BrandFormValues;
  submitLabel: string;
}) {
  const [state, formAction] = useActionState(action, {});
  const v = initial ?? {};

  return (
    <Card className="max-w-xl">
      <CardContent className="p-6">
        <form action={formAction} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input id="name" name="name" defaultValue={v.name ?? ""} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input id="slug" name="slug" placeholder="auto-generated from name" defaultValue={v.slug ?? ""} />
            <p className="text-xs text-muted-foreground">Used in storefront URLs. Leave blank to generate from the name.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="logo">Logo URL</Label>
            <Input id="logo" name="logo" type="url" defaultValue={v.logo ?? ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" rows={3} defaultValue={v.description ?? ""} />
          </div>
          <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
            <Checkbox name="featured" defaultChecked={v.featured} />
            Featured brand
          </label>

          {state?.error && <p className="text-sm text-destructive">{state.error}</p>}

          <div className="flex items-center gap-3 pt-2">
            <Submit label={submitLabel} />
            <Button asChild variant="outline">
              <Link href="/brands">Cancel</Link>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
