import Link from "next/link";
import { Pencil, Download, Upload } from "lucide-react";
import { api } from "@/lib/api";
import { money } from "@/lib/format";
import { PageHeader } from "@/components/PageHeader";
import { DeleteButton } from "@/components/DeleteButton";
import { deleteProduct } from "./actions";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const dynamic = "force-dynamic";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const search = (q ?? "").trim();
  const { products } = await api.listProducts(search || undefined);

  return (
    <>
      <PageHeader
        title="Products"
        subtitle={`${products.length} product${products.length === 1 ? "" : "s"} in the catalog`}
        action={
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <Button asChild variant="outline" size="sm" className="flex-1 sm:flex-none">
              <a href="/api/export/products" download>
                <Download size={14} className="mr-1.5" /> Export CSV
              </a>
            </Button>
            <Button asChild variant="outline" size="sm" className="flex-1 sm:flex-none">
              <Link href="/products/import">
                <Upload size={14} className="mr-1.5" /> Import CSV
              </Link>
            </Button>
            <Button asChild size="sm" className="flex-1 sm:flex-none">
              <Link href="/products/new">+ Add product</Link>
            </Button>
          </div>
        }
      />

      <form className="mb-4 w-full max-w-sm" action="/products" method="get">
        <Input name="q" defaultValue={search} placeholder="Search by name, brand, or category…" />
      </form>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px]"></TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Brand</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Pet</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Flags</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground py-10">
                  No products found.
                </TableCell>
              </TableRow>
            )}
            {products.map((p) => (
              <TableRow key={p.id}>
                <TableCell>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.img} alt={p.name} className="size-11 rounded-md object-cover bg-secondary" />
                </TableCell>
                <TableCell>
                  <div className="font-medium">{p.name}</div>
                  <div className="text-xs text-muted-foreground">#{p.id}</div>
                </TableCell>
                <TableCell>{p.brand ?? "—"}</TableCell>
                <TableCell>{p.category ?? "—"}</TableCell>
                <TableCell>{p.pet}</TableCell>
                <TableCell>
                  <div className="font-semibold">{money(p.price)}</div>
                  {p.oldPrice != null && (
                    <div className="text-xs line-through text-muted-foreground">{money(p.oldPrice)}</div>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex gap-1 flex-wrap">
                    {p.isBestseller && <Badge className="bg-amber-100 text-amber-800">Bestseller</Badge>}
                    {p.isNewArrival && <Badge className="bg-blue-100 text-blue-800">New</Badge>}
                    {!p.isBestseller && !p.isNewArrival && <span className="text-muted-foreground">—</span>}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 justify-end">
                    <Button asChild variant="outline" size="icon">
                      <Link href={`/products/${p.id}`}><Pencil size={15} /></Link>
                    </Button>
                    <DeleteButton action={deleteProduct.bind(null, p.id)} confirmMessage={`Delete "${p.name}"?`} />
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
