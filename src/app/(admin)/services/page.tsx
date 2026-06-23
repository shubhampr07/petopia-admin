import Link from "next/link";
import { api } from "@/lib/api";
import { formatDate } from "@/lib/format";
import { PageHeader } from "@/components/PageHeader";
import { DeleteButton } from "@/components/DeleteButton";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { deleteBookingService } from "./actions";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

const CATEGORY_TABS = ["All", "Grooming packages", "Training programs"];

export default async function ServicesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const { services } = await api.listBookingServices(category && category !== "All" ? category : undefined);

  return (
    <>
      <PageHeader
        title="Booking Services"
        subtitle={`${services.length} service${services.length === 1 ? "" : "s"}`}
        action={<Button asChild><Link href="/services/new">+ Add service</Link></Button>}
      />

      <div className="flex gap-2 mb-4 flex-wrap">
        {CATEGORY_TABS.map((tab) => {
          const href = tab === "All" ? "/services" : `/services?category=${encodeURIComponent(tab)}`;
          const active = (tab === "All" && !category) || category === tab;
          return (
            <Link key={tab} href={href}>
              <Badge variant={active ? "default" : "outline"} className={cn("cursor-pointer", !active && "hover:bg-accent")}>
                {tab}
              </Badge>
            </Link>
          );
        })}
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Base price</TableHead>
              <TableHead>Size pricing</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground py-10">
                  No services found.{" "}
                  <Link href="/services/new" className="text-primary underline">Add the first one.</Link>
                </TableCell>
              </TableRow>
            )}
            {services.map((s) => (
              <TableRow key={s.id}>
                <TableCell>
                  <Link href={`/services/${s.id}`} className="font-medium text-primary hover:underline">
                    {s.name}
                  </Link>
                  {s.includes && <p className="text-xs text-muted-foreground truncate max-w-[240px] mt-0.5">{s.includes}</p>}
                </TableCell>
                <TableCell className="text-sm">{s.category}</TableCell>
                <TableCell className="text-sm">{s.durationMin} min</TableCell>
                <TableCell className="text-sm font-medium">{s.price} AED</TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {s.pricingSmall != null
                    ? `S: ${s.pricingSmall} / M: ${s.pricingMedium} / L: ${s.pricingLarge}`
                    : "—"}
                </TableCell>
                <TableCell>
                  <Badge variant={s.isActive ? "default" : "secondary"}>{s.isActive ? "Active" : "Inactive"}</Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{formatDate(s.updatedAt)}</TableCell>
                <TableCell className="text-right">
                  <DeleteButton label="Delete" action={deleteBookingService.bind(null, s.id)} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </>
  );
}
