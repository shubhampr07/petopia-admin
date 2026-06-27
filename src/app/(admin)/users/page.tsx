import Link from "next/link";
import { Eye, Users } from "lucide-react";
import { api, ApiError } from "@/lib/api";
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

  let users: Awaited<ReturnType<typeof api.listUsers>>["users"] = [];
  let loadError: string | null = null;

  try {
    const res = await api.listUsers(search || undefined);
    users = res.users;
  } catch (e) {
    loadError = e instanceof ApiError ? e.message : "Failed to load users from the API";
  }

  return (
    <>
      <PageHeader
        title="Storefront Users"
        subtitle={
          loadError
            ? "Could not reach the API — check that petopia-server is running"
            : `${users.length} account${users.length === 1 ? "" : "s"} registered on petopia.ae`
        }
      />

      {loadError && (
        <Card className="mb-4 border-destructive/30 bg-destructive/5 p-4">
          <p className="text-sm text-destructive font-medium">{loadError}</p>
          <p className="text-xs text-muted-foreground mt-1">
            Ensure <code className="text-xs">ADMIN_API_URL</code> in petopia-admin points to your server (default http://localhost:4000).
          </p>
        </Card>
      )}

      <form className="mb-4 w-full max-w-sm" action="/users" method="get">
        <Input name="q" defaultValue={search} placeholder="Search by name, email, or phone…" />
      </form>

      {!loadError && users.length === 0 && (
        <Card className="mb-4 p-8 text-center">
          <Users className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm font-medium">No registered users yet</p>
          <p className="text-xs text-muted-foreground mt-1 max-w-md mx-auto">
            Customers appear here when they create an account on the Petopia website (Account → Register).
            {search ? ` No matches for “${search}”.` : " Run the server seed or register a test account on petopia-ui."}
          </p>
        </Card>
      )}

      {users.length > 0 && (
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
                <TableHead>Registered</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium">{u.name}</TableCell>
                  <TableCell className="text-muted-foreground">{u.email}</TableCell>
                  <TableCell className="text-muted-foreground">{u.phone ?? "—"}</TableCell>
                  <TableCell>{u.orderCount}</TableCell>
                  <TableCell>{u.wishlistCount}</TableCell>
                  <TableCell>{u.bookingCount}</TableCell>
                  <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                    {formatDate(u.createdAt)}
                  </TableCell>
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
      )}
    </>
  );
}
