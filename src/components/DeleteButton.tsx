"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DeleteButton({
  action,
  confirmMessage = "Delete this item? This cannot be undone.",
  label,
  size = "icon",
}: {
  action: () => Promise<{ error?: string } | void>;
  confirmMessage?: string;
  label?: string;
  size?: "icon" | "default" | "sm";
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function onClick() {
    if (!window.confirm(confirmMessage)) return;
    setError(null);
    startTransition(async () => {
      const res = await action();
      if (res && "error" in res && res.error) setError(res.error);
    });
  }

  return (
    <span className="inline-flex items-center gap-2">
      <Button type="button" variant="destructive" size={size} onClick={onClick} disabled={pending} title="Delete">
        <Trash2 size={15} />
        {label && <span>{pending ? "Deleting…" : label}</span>}
      </Button>
      {error && <span className="text-xs text-destructive">{error}</span>}
    </span>
  );
}
