import Link from "next/link";
import {
  Package,
  Tag,
  Users,
  ShoppingBag,
  CalendarCheck,
  PawPrint,
  TrendingUp,
} from "lucide-react";
import { api } from "@/lib/api";
import { money, formatDate, titleCaseSlug } from "@/lib/format";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

export const dynamic = "force-dynamic";

function StatCard({
  label,
  value,
  Icon,
  href,
}: {
  label: string;
  value: string | number;
  Icon: React.ComponentType<{ size?: number; className?: string }>;
  href: string;
}) {
  return (
    <Link href={href}>
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-5 flex items-center gap-4">
          <div className="grid place-items-center rounded-xl shrink-0 size-11 bg-secondary">
            <Icon size={22} className="text-primary" />
          </div>
          <div>
            <div className="text-2xl font-bold leading-tight">{value}</div>
            <div className="text-sm text-muted-foreground">{label}</div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default async function DashboardPage() {
  const stats = await api.stats();
  const { counts } = stats;

  return (
    <>
      <PageHeader title="Dashboard" subtitle="Overview of your store at a glance" />

      <div className="grid gap-4 mb-6 [grid-template-columns:repeat(auto-fit,minmax(min(100%,200px),1fr))]">
        <StatCard label="Products" value={counts.products} Icon={Package} href="/products" />
        <StatCard label="Brands" value={counts.brands} Icon={Tag} href="/brands" />
        <StatCard label="Storefront Users" value={counts.users} Icon={Users} href="/users" />
        <StatCard label="Orders" value={counts.orders} Icon={ShoppingBag} href="/orders" />
        <StatCard label="Service Bookings" value={counts.bookings} Icon={CalendarCheck} href="/bookings" />
        <StatCard label="Adopt Pets" value={counts.adoptPets} Icon={PawPrint} href="/adopt" />
      </div>

      <Card className="mb-8">
        <CardContent className="p-5 flex items-center gap-4">
          <div className="grid place-items-center rounded-xl shrink-0 size-11 bg-green-100">
            <TrendingUp size={22} className="text-green-700" />
          </div>
          <div>
            <div className="text-2xl font-bold leading-tight">{money(stats.revenue)}</div>
            <div className="text-sm text-muted-foreground">Total revenue (excludes cancelled orders)</div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 [grid-template-columns:repeat(auto-fit,minmax(min(100%,280px),1fr))]">
        <Card>
          <CardHeader className="flex-row items-center justify-between border-b py-4">
            <CardTitle>Recent Orders</CardTitle>
            <Link href="/orders" className="text-sm font-medium text-primary">View all</Link>
          </CardHeader>
          <CardContent className="p-0">
            {stats.recentOrders.length === 0 ? (
              <p className="px-5 py-8 text-sm text-center text-muted-foreground">No orders yet.</p>
            ) : (
              <Table>
                <TableBody>
                  {stats.recentOrders.map((o) => (
                    <TableRow key={o.id}>
                      <TableCell>
                        <Link href={`/orders/${o.id}`} className="font-medium text-primary">
                          {o.customer?.name ?? "—"}
                        </Link>
                        <div className="text-xs text-muted-foreground">{formatDate(o.createdAt)}</div>
                      </TableCell>
                      <TableCell><StatusBadge status={o.status} /></TableCell>
                      <TableCell className="text-right font-semibold">{money(o.total, o.currency)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between border-b py-4">
            <CardTitle>Recent Service Bookings</CardTitle>
            <Link href="/bookings" className="text-sm font-medium text-primary">View all</Link>
          </CardHeader>
          <CardContent className="p-0">
            {stats.recentBookings.length === 0 ? (
              <p className="px-5 py-8 text-sm text-center text-muted-foreground">No bookings yet.</p>
            ) : (
              <Table>
                <TableBody>
                  {stats.recentBookings.map((b) => (
                    <TableRow key={b.id}>
                      <TableCell>
                        <Link href={`/bookings/${b.id}`} className="font-medium text-primary">
                          {titleCaseSlug(b.serviceSlug)}
                        </Link>
                        <div className="text-xs text-muted-foreground">{formatDate(b.createdAt)}</div>
                      </TableCell>
                      <TableCell className="text-right text-sm text-muted-foreground">
                        {b.customer?.name ?? "Guest"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
