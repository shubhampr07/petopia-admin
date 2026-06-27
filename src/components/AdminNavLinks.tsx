"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ADMIN_NAV } from "@/lib/adminNav";

interface Props {
  onNavigate?: () => void;
}

export function AdminNavLinks({ onNavigate }: Props) {
  const pathname = usePathname();

  return (
    <>
      {ADMIN_NAV.map(({ href, label, Icon, exact }) => {
        const active = exact ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors touch-manipulation",
              active
                ? "bg-sidebar-primary text-sidebar-primary-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent",
            )}
          >
            <Icon size={18} className="shrink-0" />
            {label}
          </Link>
        );
      })}
    </>
  );
}
