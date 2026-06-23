import { notFound } from "next/navigation";
import { api, ApiError } from "@/lib/api";
import { getProductFormOptions } from "@/lib/options";
import { PageHeader } from "@/components/PageHeader";
import { ProductForm } from "@/components/ProductForm";
import { updateProduct } from "../actions";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const productId = Number(id);
  if (Number.isNaN(productId)) notFound();

  const product = await api.getProduct(productId).then((r) => r.product).catch((e) => {
    if (e instanceof ApiError && e.status === 404) notFound();
    throw e;
  });
  const { brands, categories } = await getProductFormOptions();

  return (
    <>
      <PageHeader title={`Edit · ${product.name}`} subtitle={`Product #${product.id}`} />
      <ProductForm
        action={updateProduct.bind(null, productId)}
        brands={brands}
        categories={categories}
        submitLabel="Save Changes"
        initial={{
          name: product.name,
          brand: product.brand,
          category: product.category,
          pet: product.pet,
          vibe: product.vibe,
          price: product.price.toString(),
          oldPrice: product.oldPrice != null ? product.oldPrice.toString() : "",
          badge: product.badge,
          tag: product.tag,
          img: product.img,
          isBestseller: product.isBestseller,
          isNewArrival: product.isNewArrival,
          detailDescription: product.detailDescription,
          detailHighlights: product.detailHighlights,
        }}
      />
    </>
  );
}
