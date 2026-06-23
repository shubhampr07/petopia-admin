"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { api, ApiError } from "@/lib/api";

function bodyFromForm(formData: FormData) {
  const highlights = String(formData.get("detailHighlights") ?? "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  return {
    name: String(formData.get("name") ?? "").trim(),
    brand: String(formData.get("brand") ?? "").trim() || null,
    category: String(formData.get("category") ?? "").trim() || null,
    pet: String(formData.get("pet") ?? "All").trim() || "All",
    vibe: ((v) => (v && v !== "none" ? v : null))(String(formData.get("vibe") ?? "").trim()),
    price: String(formData.get("price") ?? "").trim(),
    oldPrice: String(formData.get("oldPrice") ?? "").trim() || null,
    badge: String(formData.get("badge") ?? "").trim() || null,
    tag: String(formData.get("tag") ?? "").trim() || null,
    img: String(formData.get("img") ?? "").trim(),
    isBestseller: formData.get("isBestseller") === "on",
    isNewArrival: formData.get("isNewArrival") === "on",
    detailDescription: String(formData.get("detailDescription") ?? "").trim() || null,
    detailHighlights: highlights,
  };
}

export async function createProduct(
  _prev: { error?: string } | undefined,
  formData: FormData
): Promise<{ error?: string }> {
  try {
    await api.createProduct(bodyFromForm(formData));
  } catch (e) {
    return { error: e instanceof ApiError ? e.message : "Failed to create product." };
  }
  revalidatePath("/products");
  redirect("/products");
}

export async function updateProduct(
  id: number,
  _prev: { error?: string } | undefined,
  formData: FormData
): Promise<{ error?: string }> {
  try {
    await api.updateProduct(id, bodyFromForm(formData));
  } catch (e) {
    return { error: e instanceof ApiError ? e.message : "Failed to update product." };
  }
  revalidatePath("/products");
  revalidatePath(`/products/${id}`);
  redirect("/products");
}

export async function deleteProduct(id: number): Promise<{ error?: string } | void> {
  try {
    await api.deleteProduct(id);
  } catch (e) {
    return { error: e instanceof ApiError ? e.message : "Failed to delete product." };
  }
  revalidatePath("/products");
}
