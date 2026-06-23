import Link from "next/link";
import { api } from "@/lib/api";
import { formatDate } from "@/lib/format";
import { PageHeader } from "@/components/PageHeader";
import { DeleteButton } from "@/components/DeleteButton";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { deleteInquiry } from "./actions";

export const dynamic = "force-dynamic";

const STATUS_TABS = ["All", "pending", "reviewed", "approved", "rejected"];

const STATUS_VARIANT: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  pending:  "secondary",
  reviewed: "outline",
  approved: "default",
  rejected: "destructive",
};

export default async function AdoptionInquiriesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const { inquiries } = await api.listAdoptionInquiries(status && status !== "All" ? status : undefined);

  return (
    <>
      <PageHeader
        title="Adoption Inquiries"
        subtitle={`${inquiries.length} inquir${inquiries.length === 1 ? "y" : "ies"}`}
      />

      <div className="flex gap-2 mb-4 flex-wrap">
        {STATUS_TABS.map((tab) => {
          const href = tab === "All" ? "/adoption-inquiries" : `/adoption-inquiries?status=${tab}`;
          const active = (tab === "All" && !status) || status === tab;
          return (
            <Link key={tab} href={href}>
              <Badge variant={active ? "default" : "outline"} className={cn("cursor-pointer capitalize", !active && "hover:bg-accent")}>
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
              <TableHead>Applicant</TableHead>
              <TableHead>Pet</TableHead>
              <TableHead>Emirate</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Received</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {inquiries.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-10">
                  No inquiries found.
                </TableCell>
              </TableRow>
            )}
            {inquiries.map((q) => (
              <TableRow key={q.id}>
                <TableCell>
                  <Link href={`/adoption-inquiries/${q.id}`} className="font-medium text-primary hover:underline">
                    {q.fullName}
                  </Link>
                  <p className="text-xs text-muted-foreground">{q.email}</p>
                </TableCell>
                <TableCell className="text-sm">
                  <Link href={`/adopt/${q.petId}`} className="hover:underline text-primary">
                    {q.petName}
                  </Link>
                  <p className="text-xs text-muted-foreground">{q.petType}</p>
                </TableCell>
                <TableCell className="text-sm">{q.emirate}</TableCell>
                <TableCell>
                  <Badge variant={STATUS_VARIANT[q.status] ?? "outline"} className="capitalize">{q.status}</Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{formatDate(q.createdAt)}</TableCell>
                <TableCell className="text-right">
                  <DeleteButton label="Delete" action={deleteInquiry.bind(null, q.id)} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </>
  );
}
