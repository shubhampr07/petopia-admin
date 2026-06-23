import { PageHeader } from "@/components/PageHeader";
import { BrandForm } from "@/components/BrandForm";
import { createBrand } from "../actions";

export const dynamic = "force-dynamic";

export default function NewBrandPage() {
  return (
    <>
      <PageHeader title="Add Brand" subtitle="Create a new brand" />
      <BrandForm action={createBrand} submitLabel="Create Brand" />
    </>
  );
}
