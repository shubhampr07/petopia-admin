import Link from "next/link";
import { api } from "@/lib/api";
import { formatDate, titleCaseSlug } from "@/lib/format";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

/** Pull a human-friendly contact summary out of the free-form payload JSON. */
function summarize(payload: unknown): string {
  if (!payload || typeof payload !== "object") return "—";
  const p = payload as Record<string, unknown>;
  const name = p.name ?? p.fullName ?? p.ownerName ?? p.petName;
  const contact = p.phone ?? p.email ?? p.contact;
  return [name, contact].filter((x) => typeof x === "string" && x).join(" · ") || "—";
}

export default async function BookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>;
}) {
  const { service } = await searchParams;
  const { services, bookings } = await api.listBookings(service);

  return (
    <>
      <PageHeader title="Service Bookings" subtitle={`${bookings.length} booking${bookings.length === 1 ? "" : "s"}`} />

      <div className="flex gap-2 mb-4 flex-wrap">
        <Link href="/bookings">
          <Badge variant={!service ? "default" : "outline"} className={cn("cursor-pointer", service && "hover:bg-accent")}>
            All
          </Badge>
        </Link>
        {services.map((s) => (
          <Link key={s} href={`/bookings?service=${s}`}>
            <Badge variant={service === s ? "default" : "outline"} className={cn("cursor-pointer", service !== s && "hover:bg-accent")}>
              {titleCaseSlug(s)}
            </Badge>
          </Link>
        ))}
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Service</TableHead>
              <TableHead>Booked by</TableHead>
              <TableHead>Contact / details</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground py-10">
                  No bookings found.
                </TableCell>
              </TableRow>
            )}
            {bookings.map((b) => (
              <TableRow key={b.id}>
                <TableCell>
                  <Link href={`/bookings/${b.id}`} className="font-medium text-primary">
                    {titleCaseSlug(b.serviceSlug)}
                  </Link>
                </TableCell>
                <TableCell>
                  <div className="font-medium">{b.customer?.name ?? "Guest"}</div>
                  {b.customer?.email && <div className="text-xs text-muted-foreground">{b.customer.email}</div>}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{summarize(b.payload)}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{formatDate(b.createdAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </>
  );
}
