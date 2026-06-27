import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ImportClient } from "./ImportClient";

export default function ImportProductsPage() {
  return (
    <>
      <Link href="/products" className="inline-flex items-center gap-2 text-sm font-medium mb-5 text-muted-foreground hover:text-foreground">
        <ArrowLeft size={15} /> Back to products
      </Link>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Import Products</h1>
        <p className="text-sm text-muted-foreground mt-1">Bulk create or update products via CSV file.</p>
      </div>
      <ImportClient />
    </>
  );
}
