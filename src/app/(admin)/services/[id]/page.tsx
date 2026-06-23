import { notFound } from "next/navigation";
import { api } from "@/lib/api";
import { PageHeader } from "@/components/PageHeader";
import { BookingServiceForm } from "@/components/BookingServiceForm";
import { updateBookingService } from "../actions";

export const dynamic = "force-dynamic";

export default async function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let service;
  try {
    ({ service } = await api.getBookingService(id));
  } catch {
    notFound();
  }

  const action = updateBookingService.bind(null, id);

  return (
    <>
      <PageHeader title={`Edit: ${service.name}`} subtitle={service.category} />
      <BookingServiceForm action={action} initial={service} submitLabel="Save changes" />
    </>
  );
}
