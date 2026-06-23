"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { api, ApiError } from "@/lib/api";

function bodyFromForm(formData: FormData) {
  const traitsRaw = String(formData.get("traits") ?? "").trim();
  return {
    name:          String(formData.get("name")          ?? "").trim(),
    location:      String(formData.get("location")      ?? "Dubai").trim()     || "Dubai",
    type:          String(formData.get("type")          ?? "").trim()          || "Other",
    gender:        String(formData.get("gender")        ?? "").trim()          || "Unknown",
    img:           String(formData.get("img")           ?? "").trim(),
    tag:           String(formData.get("tag")           ?? "Available").trim() || "Available",
    age:           String(formData.get("age")           ?? "").trim() || null,
    breed:         String(formData.get("breed")         ?? "").trim() || null,
    size:          String(formData.get("size")          ?? "").trim() || null,
    medicalStatus: String(formData.get("medicalStatus") ?? "").trim() || null,
    summary:       String(formData.get("summary")       ?? "").trim() || null,
    traits:        traitsRaw ? traitsRaw.split(",").map((t) => t.trim()).filter(Boolean) : [],
  };
}

export async function createAdoptPet(
  _prev: { error?: string } | undefined,
  formData: FormData
): Promise<{ error?: string }> {
  try {
    await api.createAdopt(bodyFromForm(formData));
  } catch (e) {
    return { error: e instanceof ApiError ? e.message : "Failed to create listing." };
  }
  revalidatePath("/adopt");
  redirect("/adopt");
}

export async function updateAdoptPet(
  id: number,
  _prev: { error?: string } | undefined,
  formData: FormData
): Promise<{ error?: string }> {
  try {
    await api.updateAdopt(id, bodyFromForm(formData));
  } catch (e) {
    return { error: e instanceof ApiError ? e.message : "Failed to update listing." };
  }
  revalidatePath("/adopt");
  redirect("/adopt");
}

export async function deleteAdoptPet(id: number): Promise<{ error?: string } | void> {
  try {
    await api.deleteAdopt(id);
  } catch (e) {
    return { error: e instanceof ApiError ? e.message : "Failed to delete listing." };
  }
  revalidatePath("/adopt");
}
