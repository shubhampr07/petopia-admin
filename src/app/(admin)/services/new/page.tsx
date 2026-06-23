import { PageHeader } from "@/components/PageHeader";
import { BookingServiceForm } from "@/components/BookingServiceForm";
import { createBookingService } from "../actions";

export default function NewServicePage() {
  return (
    <>
      <PageHeader title="Add service" subtitle="Create a new grooming package or training program." />
      <BookingServiceForm action={createBookingService} submitLabel="Create service" />
    </>
  );
}
