import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE_NAME = "petopia_admin_token";

/** Read the admin API token from the session cookie. */
export async function getToken(): Promise<string | null> {
  const store = await cookies();
  return store.get(COOKIE_NAME)?.value ?? null;
}

export async function setToken(token: string): Promise<void> {
  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
}

export async function clearToken(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

/** Redirect to /login when there is no token. Returns the token otherwise. */
export async function requireToken(): Promise<string> {
  const token = await getToken();
  if (!token) redirect("/login");
  return token;
}
