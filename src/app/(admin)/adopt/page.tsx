import Link from "next/link";
import { Pencil } from "lucide-react";
import { api } from "@/lib/api";
import { PageHeader } from "@/components/PageHeader";
import { DeleteButton } from "@/components/DeleteButton";
import { deleteAdoptPet } from "./actions";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const dynamic = "force-dynamic";

export default async function AdoptPage() {
  const { pets } = await api.listAdopt();

  return (
    <>
      <PageHeader
        title="Adopt Pets"
        subtitle={`${pets.length} pet${pets.length === 1 ? "" : "s"} listed for adoption`}
        action={{ href: "/adopt/new", label: "+ Add Pet" }}
      />

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px]"></TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pets.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-10">
                  No pets listed yet.
                </TableCell>
              </TableRow>
            )}
            {pets.map((p) => (
              <TableRow key={p.id}>
                <TableCell>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.img} alt={p.name} className="size-11 rounded-md object-cover bg-secondary" />
                </TableCell>
                <TableCell className="font-medium">{p.name}</TableCell>
                <TableCell>{p.type}</TableCell>
                <TableCell>{p.gender}</TableCell>
                <TableCell>{p.location}</TableCell>
                <TableCell><Badge className="bg-green-100 text-green-800">{p.tag}</Badge></TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 justify-end">
                    <Button asChild variant="outline" size="icon">
                      <Link href={`/adopt/${p.id}`}><Pencil size={15} /></Link>
                    </Button>
                    <DeleteButton action={deleteAdoptPet.bind(null, p.id)} confirmMessage={`Remove "${p.name}" from adoption?`} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </>
  );
}
