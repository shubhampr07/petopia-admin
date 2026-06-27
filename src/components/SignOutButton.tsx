import { LogOut } from "lucide-react";
import { logoutAction } from "@/app/login/actions";

export function SignOutButton() {
  return (
    <form action={logoutAction}>
      <button
        type="submit"
        className="flex items-center justify-between gap-2 w-full px-3 py-2.5 rounded-lg bg-destructive text-destructive-foreground text-sm font-semibold hover:bg-destructive/90 transition"
      >
        Sign out
        <LogOut size={16} className="shrink-0" aria-hidden />
      </button>
    </form>
  );
}
