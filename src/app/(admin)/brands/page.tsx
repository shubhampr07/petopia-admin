import Link from "next/link";
import { Pencil, RefreshCw } from "lucide-react";
import { api } from "@/lib/api";
import { PageHeader } from "@/components/PageHeader";
import { DeleteButton } from "@/components/DeleteButton";
import { deleteBrand, syncBrandsFromProducts } from "./actions";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const dynamic = "force-dynamic";

export default async function BrandsPage() {
  const { brands } = await api.listBrands();

  return (
    <>
      <PageHeader
        title="Brands"
        subtitle={`${brands.length} brand${brands.length === 1 ? "" : "s"}`}
        action={{ href: "/brands/new", label: "+ Add Brand" }}
      />

      <form action={syncBrandsFromProducts} className="mb-4">
        <Button type="submit" variant="outline">
          <RefreshCw size={15} />
          Sync from existing products
        </Button>
      </form>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px]"></TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Products</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {brands.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-10">
                  No brands yet. Add one or sync from existing products.
                </TableCell>
              </TableRow>
            )}
            {brands.map((b) => (
              <TableRow key={b.id}>
                <TableCell>
                  {b.logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={b.logo} alt={b.name} className="size-10 rounded-md object-contain bg-secondary" />
                  ) : (
                    <div className="size-10 rounded-md bg-secondary" />
                  )}
                </TableCell>
                <TableCell className="font-medium">{b.name}</TableCell>
                <TableCell className="text-muted-foreground">{b.slug}</TableCell>
                <TableCell>{b.productCount}</TableCell>
                <TableCell>{b.featured ? <Badge className="bg-amber-100 text-amber-800">Featured</Badge> : "—"}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 justify-end">
                    <Button asChild variant="outline" size="icon">
                      <Link href={`/brands/${b.id}`}><Pencil size={15} /></Link>
                    </Button>
                    <DeleteButton action={deleteBrand.bind(null, b.id)} confirmMessage={`Delete brand "${b.name}"?`} />
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
