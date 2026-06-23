import { notFound } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { formatDate } from "@/lib/format";
import { PageHeader } from "@/components/PageHeader";
import { DeleteButton } from "@/components/DeleteButton";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { updateInquiryStatus, deleteInquiry } from "../actions";

export const dynamic = "force-dynamic";

const STATUSES = ["pending", "reviewed", "approved", "rejected"];
const STATUS_VARIANT: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  pending: "secondary", reviewed: "outline", approved: "default", rejected: "destructive",
};

function Field({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-sm">{value}</dd>
    </div>
  );
}

export default async function InquiryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let inquiry;
  try {
    ({ inquiry } = await api.getAdoptionInquiry(id));
  } catch {
    notFound();
  }

  const p = inquiry.payload as Record<string, unknown>;

  return (
    <>
      <PageHeader
        title={`Inquiry — ${inquiry.fullName}`}
        subtitle={`For: ${inquiry.pet.name} · Received ${formatDate(inquiry.createdAt)}`}
        action={
          <DeleteButton
            label="Delete inquiry"
            action={async () => { "use server"; await deleteInquiry(id); }}
          />
        }
      />

      {/* Status update */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <span className="text-sm font-medium">Status:</span>
        <Badge variant={STATUS_VARIANT[inquiry.status] ?? "outline"} className="capitalize">{inquiry.status}</Badge>
        {STATUSES.filter((s) => s !== inquiry.status).map((s) => {
          async function setStatus() {
            "use server";
            await updateInquiryStatus(id, s);
          }
          return (
            <form key={s} action={setStatus}>
              <Button type="submit" variant="outline" size="sm" className="capitalize">{s}</Button>
            </form>
          );
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Pet */}
        <Card>
          <CardContent className="p-5">
            <h3 className="font-semibold mb-4">Pet</h3>
            <div className="flex items-center gap-4">
              <img src={inquiry.pet.img} alt={inquiry.pet.name} className="w-16 h-16 rounded-lg object-cover" />
              <div>
                <p className="font-medium">{inquiry.pet.name}</p>
                <p className="text-sm text-muted-foreground">{inquiry.pet.type}</p>
                <Link href={`/adopt/${inquiry.pet.id}`} className="text-xs text-primary hover:underline">View profile</Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal */}
        <Card>
          <CardContent className="p-5">
            <h3 className="font-semibold mb-4">Personal information</h3>
            <dl className="space-y-3">
              <Field label="Full name"     value={inquiry.fullName} />
              <Field label="Phone"         value={inquiry.phone} />
              <Field label="Email"         value={inquiry.email} />
              <Field label="Emirates ID"   value={inquiry.emiratesId} />
              <Field label="Emirate"       value={inquiry.emirate} />
              <Field label="Area"          value={inquiry.area} />
            </dl>
          </CardContent>
        </Card>

        {/* Living situation */}
        <Card>
          <CardContent className="p-5">
            <h3 className="font-semibold mb-4">Living situation</h3>
            <dl className="space-y-3">
              <Field label="Home type"           value={p.homeType as string} />
              <Field label="Garden / outdoor"    value={p.hasGarden as string} />
              <Field label="Ownership"           value={p.ownership as string} />
              <Field label="Landlord permits pets" value={p.landlordOk as string} />
            </dl>
          </CardContent>
        </Card>

        {/* Lifestyle */}
        <Card>
          <CardContent className="p-5">
            <h3 className="font-semibold mb-4">Lifestyle &amp; experience</h3>
            <dl className="space-y-3">
              <Field label="Had pets before"    value={p.hadPets as string} />
              <Field label="Previous pets"      value={p.prevPetDesc as string} />
              <Field label="Hours alone / day"  value={p.hoursAlone as string} />
              <Field label="Primary caregiver"  value={p.caregiver as string} />
              <Field label="Children at home"   value={p.hasChildren as string} />
              <Field label="Children's ages"    value={p.childrenAges as string} />
              <Field label="Other pets"         value={p.hasOtherPets as string} />
              <Field label="Other pets desc."   value={p.otherPetsDesc as string} />
            </dl>
          </CardContent>
        </Card>

        {/* Commitment */}
        <Card>
          <CardContent className="p-5">
            <h3 className="font-semibold mb-4">Pet care commitment</h3>
            <dl className="space-y-3">
              <Field label="Cost readiness"    value={p.costReady as string} />
              <Field label="Family agreement"  value={p.familyAgreed as string} />
              <Field label="Travel / relocate plan" value={p.travelPlan as string} />
              <Field label="Why this pet"      value={p.whyThisPet as string} />
            </dl>
          </CardContent>
        </Card>

        {/* Vet */}
        <Card>
          <CardContent className="p-5">
            <h3 className="font-semibold mb-4">Veterinary reference</h3>
            <dl className="space-y-3">
              <Field label="Has a vet"      value={p.hasVet as string} />
              <Field label="Vet contact"    value={p.vetContact as string} />
            </dl>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
