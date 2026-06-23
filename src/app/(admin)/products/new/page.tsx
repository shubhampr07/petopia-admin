import { PageHeader } from "@/components/PageHeader";
import { ProductForm } from "@/components/ProductForm";
import { getProductFormOptions } from "@/lib/options";
import { createProduct } from "../actions";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const { brands, categories } = await getProductFormOptions();

  return (
    <>
      <PageHeader title="Add Product" subtitle="Create a new catalog item" />
      <ProductForm action={createProduct} brands={brands} categories={categories} submitLabel="Create Product" />
    </>
  );
}
