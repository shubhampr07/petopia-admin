import type { ReactNode } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type ActionProp = { href: string; label: string } | ReactNode;

function isLinkAction(a: ActionProp): a is { href: string; label: string } {
  return typeof a === "object" && a !== null && "href" in (a as object) && "label" in (a as object);
}

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ActionProp;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-4 mb-4 sm:mb-6">
      <div className="min-w-0">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">{title}</h1>
        {subtitle && <p className="text-sm mt-1 text-muted-foreground">{subtitle}</p>}
      </div>
      {action && (
        isLinkAction(action) ? (
          <Button asChild className="w-full sm:w-auto shrink-0">
            <Link href={action.href}>{action.label}</Link>
          </Button>
        ) : (
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto sm:justify-end shrink-0">
            {action}
          </div>
        )
      )}
    </div>
  );
}
