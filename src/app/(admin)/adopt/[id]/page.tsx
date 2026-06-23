import { notFound } from "next/navigation";
import { api, ApiError } from "@/lib/api";
import { PageHeader } from "@/components/PageHeader";
import { AdoptPetForm } from "@/components/AdoptPetForm";
import { updateAdoptPet } from "../actions";

export const dynamic = "force-dynamic";

export default async function EditAdoptPetPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const petId = Number(id);
  if (Number.isNaN(petId)) notFound();

  const pet = await api.getAdopt(petId).then((r) => r.pet).catch((e) => {
    if (e instanceof ApiError && e.status === 404) notFound();
    throw e;
  });

  return (
    <>
      <PageHeader title={`Edit · ${pet.name}`} />
      <AdoptPetForm
        action={updateAdoptPet.bind(null, petId)}
        submitLabel="Save Changes"
        initial={{
          name: pet.name,
          location: pet.location,
          type: pet.type,
          gender: pet.gender,
          img: pet.img,
          tag: pet.tag,
        }}
      />
    </>
  );
}
