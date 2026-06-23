"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Tag,
  PawPrint,
  ShoppingBag,
  CalendarCheck,
  Users,
  LogOut,
  Scissors,
  ClipboardList,
} from "lucide-react";
import { logoutAction } from "@/app/login/actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/",                    label: "Dashboard",          Icon: LayoutDashboard, exact: true },
  { href: "/products",            label: "Products",           Icon: Package },
  { href: "/brands",              label: "Brands",             Icon: Tag },
  { href: "/adopt",               label: "Adopt Pets",         Icon: PawPrint },
  { href: "/adoption-inquiries",  label: "Adopt Inquiries",    Icon: ClipboardList },
  { href: "/services",            label: "Booking Services",   Icon: Scissors },
  { href: "/orders",              label: "Orders",             Icon: ShoppingBag },
  { href: "/bookings",            label: "Service Bookings",   Icon: CalendarCheck },
  { href: "/users",               label: "Users",              Icon: Users },
];

export function Sidebar({ email }: { email: string }) {
  const pathname = usePathname();

  return (
    <aside className="flex flex-col shrink-0 w-[248px] bg-sidebar border-r border-sidebar-border h-screen sticky top-0">
      <div className="flex items-center gap-3 px-5 py-5">
        <div className="grid place-items-center rounded-xl size-9 bg-primary">
          <PawPrint className="text-primary-foreground" size={20} />
        </div>
        <div>
          <div className="font-bold leading-tight text-sidebar-foreground">Petopia</div>
          <div className="text-xs text-muted-foreground">Admin Panel</div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        {NAV.map(({ href, label, Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                active
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent"
              )}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-sidebar-border">
        <div className="px-3 pb-3 text-xs truncate text-muted-foreground">{email}</div>
        <form action={logoutAction}>
          <Button type="submit" variant="outline" className="w-full">
            <LogOut size={16} />
            Sign out
          </Button>
        </form>
      </div>
    </aside>
  );
}
