"use client";

import { useActionState } from "react";
import { adjustPawPointsAction } from "./actions";

const inp = "w-full px-3 py-2 text-sm border border-input rounded-lg bg-background focus:outline-none focus:ring-1 focus:ring-ring";

export function PawPointsAdjustForm({
  userId,
  currentBalance,
}: {
  userId: string;
  currentBalance: number;
}) {
  const bound = adjustPawPointsAction.bind(null, userId);
  const [state, action, pending] = useActionState(bound, null);

  return (
    <form action={action} className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Current balance: <strong className="text-foreground">{currentBalance.toLocaleString()} pts</strong>
      </p>
      <div>
        <label className="block text-xs font-medium text-muted-foreground mb-1.5">
          Adjust (+ or − points)
        </label>
        <input
          name="delta"
          type="number"
          required
          step={1}
          placeholder="e.g. 100 or -50"
          className={inp}
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-muted-foreground mb-1.5">Reason</label>
        <input name="reason" type="text" placeholder="Instagram bonus, correction…" className={inp} />
      </div>
      {state?.error && (
        <p className="text-sm text-destructive">{state.error}</p>
      )}
      {state?.ok && (
        <p className="text-sm text-green-700">Updated — new balance: {state.balance?.toLocaleString()} pts</p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="w-full py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-60"
      >
        {pending ? "Saving…" : "Apply adjustment"}
      </button>
    </form>
  );
}
