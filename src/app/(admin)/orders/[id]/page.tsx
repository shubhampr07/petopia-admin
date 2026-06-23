import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import { money, formatDate } from "@/lib/format";
import { StatusBadge } from "@/components/StatusBadge";
import { OrderStatusForm } from "@/components/OrderStatusForm";
import { DeleteButton } from "@/components/DeleteButton";
import { updateOrderStatus, deleteOrder } from "../actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const dynamic = "force-dynamic";

function renderAddress(addr: unknown): string {
  if (!addr || typeof addr !== "object") return "—";
  const a = addr as Record<string, unknown>;
  const parts = [a.name, a.line1, a.line2, a.city, a.emirate, a.country, a.phone]
    .filter((x) => typeof x === "string" && x.trim())
    .join(", ");
  return parts || JSON.stringify(addr);
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await api.getOrder(id).then((r) => r.order).catch((e) => {
    if (e instanceof ApiError && e.status === 404) notFound();
    throw e;
  });

  return (
    <>
      <Link href="/orders" className="inline-flex items-center gap-2 text-sm font-medium mb-4 text-primary">
        <ArrowLeft size={16} /> Back to orders
      </Link>

      <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Order #{order.id.slice(-8)}</h1>
          <p className="text-sm mt-1 text-muted-foreground inline-flex items-center gap-2">
            Placed {formatDate(order.createdAt)} <StatusBadge status={order.status} />
          </p>
        </div>
        <DeleteButton action={deleteOrder.bind(null, order.id)} confirmMessage="Permanently delete this order?" label="Delete order" size="default" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader className="border-b py-4"><CardTitle>Items</CardTitle></CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead>Unit price</TableHead>
                    <TableHead className="text-right">Line total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.items.map((i) => (
                    <TableRow key={i.id}>
                      <TableCell className="font-medium">
                        {i.name}
                        <div className="text-xs text-muted-foreground">#{i.productId}</div>
                      </TableCell>
                      <TableCell>{i.quantity}</TableCell>
                      <TableCell>{money(i.unitPrice, order.currency)}</TableCell>
                      <TableCell className="text-right font-semibold">{money(i.lineTotal, order.currency)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="flex justify-between items-center px-4 py-4 border-t">
                <span className="font-semibold">Total</span>
                <span className="text-lg font-bold">{money(order.total, order.currency)}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <h2 className="font-semibold mb-3">Update status</h2>
              <OrderStatusForm action={updateOrderStatus.bind(null, order.id)} current={order.status} />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-5">
              <h2 className="font-semibold mb-3">Customer</h2>
              {order.customer ? (
                <div className="text-sm space-y-1">
                  <Link href={`/users/${order.customer.id}`} className="font-medium text-primary">
                    {order.customer.name}
                  </Link>
                  <div className="text-muted-foreground">{order.customer.email}</div>
                  {order.customer.phone && <div className="text-muted-foreground">{order.customer.phone}</div>}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">—</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <h2 className="font-semibold mb-3">Shipping address</h2>
              <p className="text-sm text-muted-foreground">{renderAddress(order.shippingAddress)}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
