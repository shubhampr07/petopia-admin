import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import { money, formatDate, titleCaseSlug } from "@/lib/format";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { DeleteButton } from "@/components/DeleteButton";
import { deleteUserAndReturn } from "../actions";
import { PawPointsAdjustForm } from "../PawPointsAdjustForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const dynamic = "force-dynamic";

export default async function UserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await api.getUser(id).then((r) => r.user).catch((e) => {
    if (e instanceof ApiError && e.status === 404) notFound();
    throw e;
  });

  return (
    <>
      <Link href="/users" className="inline-flex items-center gap-2 text-sm font-medium mb-4 text-primary">
        <ArrowLeft size={16} /> Back to users
      </Link>

      <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{user.name}</h1>
          <p className="text-sm mt-1 text-muted-foreground">
            {user.email}
            {user.phone ? ` · ${user.phone}` : ""} · Registered {formatDate(user.createdAt)} via petopia.ae
          </p>
        </div>
        <DeleteButton
          action={deleteUserAndReturn.bind(null, user.id)}
          confirmMessage={`Delete "${user.name}"? This cannot be undone.`}
          label="Delete user"
          size="default"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <Card>
          <CardHeader className="border-b py-4"><CardTitle>Orders ({user.orders.length})</CardTitle></CardHeader>
          <CardContent className="p-0">
            {user.orders.length === 0 ? (
              <p className="px-5 py-8 text-sm text-muted-foreground">No orders.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {user.orders.map((o) => (
                    <TableRow key={o.id}>
                      <TableCell>
                        <Link href={`/orders/${o.id}`} className="font-medium text-primary">#{o.id.slice(-8)}</Link>
                      </TableCell>
                      <TableCell><StatusBadge status={o.status} /></TableCell>
                      <TableCell className="font-semibold">{money(o.total, o.currency)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{formatDate(o.createdAt)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader className="border-b py-4">
              <CardTitle>Paw Points</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              {user.pawPoints ? (
                <>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <div className="text-muted-foreground text-xs">Balance</div>
                      <div className="font-bold text-lg">{user.pawPoints.balance.toLocaleString()} pts</div>
                      <div className="text-xs text-muted-foreground">AED {user.pawPoints.balanceAed.toFixed(2)}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground text-xs">Tier</div>
                      <div className="font-semibold">{user.pawPoints.tierLabel}</div>
                      {user.pawPoints.earnBonusPct > 0 && (
                        <div className="text-xs text-muted-foreground">+{user.pawPoints.earnBonusPct}% earn bonus</div>
                      )}
                    </div>
                    <div>
                      <div className="text-muted-foreground text-xs">Lifetime earned</div>
                      <div className="font-medium">{user.pawPoints.lifetimeEarned.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground text-xs">Lifetime redeemed</div>
                      <div className="font-medium">{user.pawPoints.lifetimeRedeemed.toLocaleString()}</div>
                    </div>
                  </div>
                  <PawPointsAdjustForm userId={user.id} currentBalance={user.pawPoints.balance} />
                </>
              ) : (
                <PawPointsAdjustForm userId={user.id} currentBalance={0} />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="border-b py-4"><CardTitle>Wishlist ({user.wishlist.length})</CardTitle></CardHeader>
            <CardContent className="p-4 space-y-3">
              {user.wishlist.length === 0 ? (
                <p className="text-sm text-muted-foreground">Empty.</p>
              ) : (
                user.wishlist.map((w) => (
                  <div key={w.id} className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={w.img} alt={w.name} className="size-9 rounded-md object-cover bg-secondary" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{w.name}</div>
                      <div className="text-xs text-muted-foreground">{money(w.price)}</div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="border-b py-4"><CardTitle>Bookings ({user.bookings.length})</CardTitle></CardHeader>
            <CardContent className="p-4 space-y-2">
              {user.bookings.length === 0 ? (
                <p className="text-sm text-muted-foreground">None.</p>
              ) : (
                user.bookings.map((b) => (
                  <Link key={b.id} href={`/bookings/${b.id}`} className="flex items-center justify-between text-sm">
                    <span className="font-medium text-primary">{titleCaseSlug(b.serviceSlug)}</span>
                    <span className="text-xs text-muted-foreground">{formatDate(b.createdAt)}</span>
                  </Link>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
