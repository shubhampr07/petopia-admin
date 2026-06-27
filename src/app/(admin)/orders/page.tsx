import Link from "next/link";
import { api } from "@/lib/api";
import { money, formatDate } from "@/lib/format";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Search, Download, TrendingUp, ShoppingBag, Clock, Truck } from "lucide-react";
import type { OrderListItem } from "@/lib/api";

export const dynamic = "force-dynamic";

const STATUS_FILTERS = ["All", "PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"];

const STATUS_LABEL: Record<string, string> = {
  PENDING: "Pending", PAID: "Paid", SHIPPED: "Shipped",
  DELIVERED: "Delivered", CANCELLED: "Cancelled",
};

function StatCard({
  label, value, sub, icon: Icon, color,
}: {
  label: string; value: string; sub?: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color: string;
}) {
  return (
    <Card>
      <CardContent className="p-5 flex items-center gap-4">
        <div className={cn("rounded-xl p-3", color)}>
          <Icon size={20} className="text-white" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{label}</p>
          <p className="text-xl font-bold mt-0.5">{value}</p>
          {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
        </div>
      </CardContent>
    </Card>
  );
}

function buildExportUrl(params: { status?: string; search?: string; dateFrom?: string; dateTo?: string }) {
  const qs = new URLSearchParams();
  if (params.status && params.status !== "All") qs.set("status", params.status);
  if (params.search) qs.set("search", params.search);
  if (params.dateFrom) qs.set("dateFrom", params.dateFrom);
  if (params.dateTo) qs.set("dateTo", params.dateTo);
  const q = qs.toString();
  return `/api/export/orders${q ? `?${q}` : ""}`;
}

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string; dateFrom?: string; dateTo?: string }>;
}) {
  const { status, q, dateFrom, dateTo } = await searchParams;
  const activeStatus = status && STATUS_FILTERS.includes(status) ? status : "All";
  const search = (q ?? "").trim();

  const { orders } = await api.listOrders({
    status: activeStatus !== "All" ? activeStatus : undefined,
    search: search || undefined,
    dateFrom: dateFrom || undefined,
    dateTo: dateTo || undefined,
  });

  // Stats — computed from current result set (when no filter) or clearly labelled as filtered
  const isFiltered = activeStatus !== "All" || search || dateFrom || dateTo;
  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
  const pendingCount = orders.filter((o) => o.status === "PENDING").length;
  const paidCount = orders.filter((o) => o.status === "PAID").length;
  const shippedCount = orders.filter((o) => o.status === "SHIPPED").length;

  const exportUrl = buildExportUrl({ status: activeStatus, search, dateFrom, dateTo });

  return (
    <>
      <PageHeader
        title="Orders"
        subtitle={`${orders.length} order${orders.length === 1 ? "" : "s"}${isFiltered ? " · filtered" : ""}`}
        action={
          <Button asChild variant="outline" size="sm">
            <a href={exportUrl} download>
              <Download size={15} className="mr-1.5" />
              Export CSV
            </a>
          </Button>
        }
      />

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label={isFiltered ? "Revenue (filtered)" : "Total revenue"} value={money(totalRevenue)} icon={TrendingUp} color="bg-emerald-500" />
        <StatCard label="Orders" value={String(orders.length)} sub={isFiltered ? "matching filters" : "all time"} icon={ShoppingBag} color="bg-blue-500" />
        <StatCard label="Pending" value={String(pendingCount)} sub="awaiting payment" icon={Clock} color="bg-amber-500" />
        <StatCard label="Ready to ship" value={String(paidCount + shippedCount)} sub={`${paidCount} paid · ${shippedCount} shipped`} icon={Truck} color="bg-violet-500" />
      </div>

      {/* Filters */}
      <Card className="mb-4">
        <CardContent className="p-4">
          <form method="get" action="/orders" className="flex flex-wrap gap-3 items-end">
            {activeStatus !== "All" && <input type="hidden" name="status" value={activeStatus} />}
            <div className="flex-1 min-w-[200px] relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                name="q"
                defaultValue={search}
                placeholder="Search by name, email, or order ID…"
                className="pl-8"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs font-medium text-muted-foreground whitespace-nowrap">From</label>
              <Input type="date" name="dateFrom" defaultValue={dateFrom ?? ""} className="w-36" />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs font-medium text-muted-foreground whitespace-nowrap">To</label>
              <Input type="date" name="dateTo" defaultValue={dateTo ?? ""} className="w-36" />
            </div>
            <Button type="submit" size="sm">Apply</Button>
            {isFiltered && (
              <Button asChild variant="ghost" size="sm"><Link href="/orders">Clear</Link></Button>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Status tabs */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {STATUS_FILTERS.map((s) => {
          const count = s === "All" ? orders.length : orders.filter((o) => o.status === s).length;
          const href = s === "All"
            ? (search || dateFrom || dateTo ? `/orders?${new URLSearchParams({ ...(search ? { q: search } : {}), ...(dateFrom ? { dateFrom } : {}), ...(dateTo ? { dateTo } : {}) }).toString()}` : "/orders")
            : `/orders?status=${s}${search ? `&q=${encodeURIComponent(search)}` : ""}${dateFrom ? `&dateFrom=${dateFrom}` : ""}${dateTo ? `&dateTo=${dateTo}` : ""}`;
          return (
            <Link key={s} href={href}>
              <Badge
                variant={activeStatus === s ? "default" : "outline"}
                className={cn("cursor-pointer gap-1", activeStatus !== s && "hover:bg-accent")}
              >
                {STATUS_LABEL[s] ?? s}
                {!isFiltered || s === "All" || activeStatus === s
                  ? <span className="opacity-70 text-[10px]">{count}</span>
                  : null}
              </Badge>
            </Link>
          );
        })}
      </div>

      {/* Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-14">
                  No orders found.{" "}
                  {isFiltered && (
                    <Link href="/orders" className="text-primary underline">Clear filters</Link>
                  )}
                </TableCell>
              </TableRow>
            )}
            {orders.map((o: OrderListItem) => (
              <TableRow key={o.id} className="hover:bg-muted/40">
                <TableCell>
                  <Link href={`/orders/${o.id}`} className="font-mono text-sm font-semibold text-primary hover:underline">
                    #{o.id.slice(-8).toUpperCase()}
                  </Link>
                </TableCell>
                <TableCell>
                  <div className="font-medium">{o.customer?.name ?? <span className="text-muted-foreground">Guest</span>}</div>
                  {o.customer?.email && <div className="text-xs text-muted-foreground">{o.customer.email}</div>}
                </TableCell>
                <TableCell className="text-sm">{o.itemCount} item{o.itemCount !== 1 ? "s" : ""}</TableCell>
                <TableCell className="font-semibold">{money(o.total, o.currency)}</TableCell>
                <TableCell><StatusBadge status={o.status} /></TableCell>
                <TableCell className="text-sm text-muted-foreground">{formatDate(o.createdAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </>
  );
}
