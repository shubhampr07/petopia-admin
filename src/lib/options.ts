import "server-only";
import { api } from "./api";

/** Brand names (from the Brand table merged with brands used on products) and
 *  distinct categories — used to populate the product form datalists. */
export async function getProductFormOptions(): Promise<{ brands: string[]; categories: string[] }> {
  const [{ brands }, { products }] = await Promise.all([api.listBrands(), api.listProducts()]);

  const brandSet = new Set<string>();
  brands.forEach((b) => brandSet.add(b.name));
  products.forEach((p) => p.brand && brandSet.add(p.brand));

  const categorySet = new Set<string>();
  products.forEach((p) => p.category && categorySet.add(p.category));

  return {
    brands: [...brandSet].sort((a, b) => a.localeCompare(b)),
    categories: [...categorySet].sort((a, b) => a.localeCompare(b)),
  };
}
