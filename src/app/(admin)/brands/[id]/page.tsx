import { notFound } from "next/navigation";
import { api, ApiError } from "@/lib/api";
import { PageHeader } from "@/components/PageHeader";
import { BrandForm } from "@/components/BrandForm";
import { updateBrand } from "../actions";

export const dynamic = "force-dynamic";

export default async function EditBrandPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const brandId = Number(id);
  if (Number.isNaN(brandId)) notFound();

  const brand = await api.getBrand(brandId).then((r) => r.brand).catch((e) => {
    if (e instanceof ApiError && e.status === 404) notFound();
    throw e;
  });

  return (
    <>
      <PageHeader title={`Edit · ${brand.name}`} />
      <BrandForm
        action={updateBrand.bind(null, brandId)}
        submitLabel="Save Changes"
        initial={{
          name: brand.name,
          slug: brand.slug,
          logo: brand.logo,
          description: brand.description,
          featured: brand.featured,
        }}
      />
    </>
  );
}
