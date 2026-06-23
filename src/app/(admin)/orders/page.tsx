import Link from "next/link";
import { api } from "@/lib/api";
import { money, formatDate } from "@/lib/format";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

const STATUS_FILTERS = ["All", "PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"];

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const active = status && STATUS_FILTERS.includes(status) ? status : "All";
  const { orders } = await api.listOrders(active !== "All" ? active : undefined);

  return (
    <>
      <PageHeader title="Orders" subtitle={`${orders.length} order${orders.length === 1 ? "" : "s"}`} />

      <div className="flex gap-2 mb-4 flex-wrap">
        {STATUS_FILTERS.map((s) => (
          <Link key={s} href={s === "All" ? "/orders" : `/orders?status=${s}`}>
            <Badge
              variant={active === s ? "default" : "outline"}
              className={cn("cursor-pointer", active !== s && "hover:bg-accent")}
            >
              {s}
            </Badge>
          </Link>
        ))}
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
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
                <TableCell colSpan={6} className="text-center text-muted-foreground py-10">
                  No orders found.
                </TableCell>
              </TableRow>
            )}
            {orders.map((o) => (
              <TableRow key={o.id}>
                <TableCell>
                  <Link href={`/orders/${o.id}`} className="font-medium text-primary">
                    #{o.id.slice(-8)}
                  </Link>
                </TableCell>
                <TableCell>
                  <div className="font-medium">{o.customer?.name ?? "—"}</div>
                  <div className="text-xs text-muted-foreground">{o.customer?.email}</div>
                </TableCell>
                <TableCell>{o.itemCount}</TableCell>
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
