"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const STATUSES = ["PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"];

function Submit() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Updating…" : "Update"}
    </Button>
  );
}

export function OrderStatusForm({
  action,
  current,
}: {
  action: (
    prev: { error?: string; ok?: boolean } | undefined,
    formData: FormData
  ) => Promise<{ error?: string; ok?: boolean }>;
  current: string;
}) {
  const [state, formAction] = useActionState(action, {});

  return (
    <form action={formAction} className="flex items-center gap-3 flex-wrap">
      <Select name="status" defaultValue={current}>
        <SelectTrigger className="w-[200px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
        </SelectContent>
      </Select>
      <Submit />
      {state?.ok && <span className="text-sm text-green-700">Saved ✓</span>}
      {state?.error && <span className="text-sm text-destructive">{state.error}</span>}
    </form>
  );
}
