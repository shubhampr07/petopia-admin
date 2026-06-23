import { Badge } from "@/components/ui/badge";

const CLASSES: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-800",
  PAID: "bg-blue-100 text-blue-800",
  SHIPPED: "bg-indigo-100 text-indigo-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

export function StatusBadge({ status }: { status: string }) {
  return <Badge className={CLASSES[status] ?? "bg-muted text-muted-foreground"}>{status}</Badge>;
}
