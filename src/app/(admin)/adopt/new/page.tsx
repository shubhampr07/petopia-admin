import { PageHeader } from "@/components/PageHeader";
import { AdoptPetForm } from "@/components/AdoptPetForm";
import { createAdoptPet } from "../actions";

export const dynamic = "force-dynamic";

export default function NewAdoptPetPage() {
  return (
    <>
      <PageHeader title="Add Pet" subtitle="List a new pet for adoption" />
      <AdoptPetForm action={createAdoptPet} submitLabel="Create Listing" />
    </>
  );
}
