import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import { formatDate, titleCaseSlug } from "@/lib/format";
import { PageHeader } from "@/components/PageHeader";
import { DeleteButton } from "@/components/DeleteButton";
import { deleteBooking } from "../actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

export const dynamic = "force-dynamic";

function entries(payload: unknown): [string, string][] {
  if (!payload || typeof payload !== "object") return [];
  return Object.entries(payload as Record<string, unknown>).map(([k, v]) => [
    k,
    typeof v === "object" ? JSON.stringify(v) : String(v),
  ]);
}

export default async function BookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const booking = await api.getBooking(id).then((r) => r.booking).catch((e) => {
    if (e instanceof ApiError && e.status === 404) notFound();
    throw e;
  });

  const fields = entries(booking.payload);

  return (
    <>
      <Link href="/bookings" className="inline-flex items-center gap-2 text-sm font-medium mb-4 text-primary">
        <ArrowLeft size={16} /> Back to bookings
      </Link>

      <PageHeader title={titleCaseSlug(booking.serviceSlug)} subtitle={`Booked ${formatDate(booking.createdAt)}`} />

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <Card>
          <CardHeader className="border-b py-4"><CardTitle>Submitted details</CardTitle></CardHeader>
          <CardContent className="p-0">
            {fields.length === 0 ? (
              <p className="px-5 py-8 text-sm text-muted-foreground">No details submitted.</p>
            ) : (
              <Table>
                <TableBody>
                  {fields.map(([k, v]) => (
                    <TableRow key={k}>
                      <TableCell className="font-medium w-[35%] capitalize">
                        {k.replace(/([A-Z])/g, " $1").replace(/[_-]/g, " ")}
                      </TableCell>
                      <TableCell className="text-muted-foreground whitespace-pre-wrap">{v || "—"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-5">
              <h2 className="font-semibold mb-3">Booked by</h2>
              {booking.customer ? (
                <div className="text-sm space-y-1">
                  <Link href={`/users/${booking.customer.id}`} className="font-medium text-primary">
                    {booking.customer.name}
                  </Link>
                  <div className="text-muted-foreground">{booking.customer.email}</div>
                  {booking.customer.phone && <div className="text-muted-foreground">{booking.customer.phone}</div>}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Guest (not signed in)</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <h2 className="font-semibold mb-3">Manage</h2>
              <DeleteButton action={deleteBooking.bind(null, booking.id)} confirmMessage="Delete this booking?" label="Delete booking" size="default" />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
