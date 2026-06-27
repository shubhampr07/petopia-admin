import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Package,
  Tag,
  PawPrint,
  ShoppingBag,
  CalendarCheck,
  Users,
  ClipboardList,
} from "lucide-react";

export type AdminNavItem = {
  href: string;
  label: string;
  Icon: LucideIcon;
  exact?: boolean;
};

export const ADMIN_NAV: AdminNavItem[] = [
  { href: "/", label: "Dashboard", Icon: LayoutDashboard, exact: true },
  { href: "/products", label: "Products", Icon: Package },
  { href: "/brands", label: "Brands", Icon: Tag },
  { href: "/adopt", label: "Adopt Pets", Icon: PawPrint },
  { href: "/adoption-inquiries", label: "Adopt Inquiries", Icon: ClipboardList },
  { href: "/orders", label: "Orders", Icon: ShoppingBag },
  { href: "/bookings", label: "Service Bookings", Icon: CalendarCheck },
  { href: "/users", label: "Storefront Users", Icon: Users },
];
