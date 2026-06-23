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
    <div className="flex items-end justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {subtitle && <p className="text-sm mt-1 text-muted-foreground">{subtitle}</p>}
      </div>
      {action && (
        isLinkAction(action) ? (
          <Button asChild>
            <Link href={action.href}>{action.label}</Link>
          </Button>
        ) : (
          <>{action}</>
        )
      )}
    </div>
  );
}
