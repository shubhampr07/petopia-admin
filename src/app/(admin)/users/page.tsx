import Link from "next/link";
import { Eye } from "lucide-react";
import { api } from "@/lib/api";
import { formatDate } from "@/lib/format";
import { PageHeader } from "@/components/PageHeader";
import { DeleteButton } from "@/components/DeleteButton";
import { deleteUser } from "./actions";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const dynamic = "force-dynamic";

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const search = (q ?? "").trim();
  const { users } = await api.listUsers(search || undefined);

  return (
    <>
      <PageHeader title="Users" subtitle={`${users.length} registered customer${users.length === 1 ? "" : "s"}`} />

      <form className="mb-4 max-w-sm" action="/users" method="get">
        <Input name="q" defaultValue={search} placeholder="Search by name, email, or phone…" />
      </form>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Orders</TableHead>
              <TableHead>Wishlist</TableHead>
              <TableHead>Bookings</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground py-10">
                  No users found.
                </TableCell>
              </TableRow>
            )}
            {users.map((u) => (
              <TableRow key={u.id}>
                <TableCell className="font-medium">{u.name}</TableCell>
                <TableCell className="text-muted-foreground">{u.email}</TableCell>
                <TableCell className="text-muted-foreground">{u.phone ?? "—"}</TableCell>
                <TableCell>{u.orderCount}</TableCell>
                <TableCell>{u.wishlistCount}</TableCell>
                <TableCell>{u.bookingCount}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{formatDate(u.createdAt)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 justify-end">
                    <Button asChild variant="outline" size="icon">
                      <Link href={`/users/${u.id}`}><Eye size={15} /></Link>
                    </Button>
                    <DeleteButton action={deleteUser.bind(null, u.id)} confirmMessage={`Delete user "${u.name}"?`} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </>
  );
}
