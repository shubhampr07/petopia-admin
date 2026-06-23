"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { PawPrint } from "lucide-react";
import { loginAction } from "./actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "Signing in…" : "Sign in"}
    </Button>
  );
}

export default function LoginPage() {
  const [state, formAction] = useActionState(loginAction, {});

  return (
    <main className="min-h-screen grid place-items-center px-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="items-center text-center">
          <div className="grid place-items-center rounded-2xl bg-primary mb-2" style={{ width: 52, height: 52 }}>
            <PawPrint className="text-primary-foreground" size={26} />
          </div>
          <CardTitle className="text-xl">Petopia Admin</CardTitle>
          <CardDescription>Sign in to manage the store</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" autoComplete="username" placeholder="admin@petopia.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" autoComplete="current-password" placeholder="••••••••" required />
            </div>
            {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
            <SubmitButton />
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
