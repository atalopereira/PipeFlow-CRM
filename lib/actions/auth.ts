"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  CURRENT_WORKSPACE_COOKIE,
  WORKSPACE_COOKIE_MAX_AGE,
} from "@/lib/constants/workspace-cookie";
import { createClient } from "@/lib/supabase/server";

export interface ActionResult {
  error?: string;
}

export interface SignUpResult extends ActionResult {
  needsConfirmation?: boolean;
}

function translateAuthError(message: string): string {
  switch (message) {
    case "Invalid login credentials":
      return "E-mail ou senha incorretos.";
    case "User already registered":
      return "Este e-mail já está cadastrado.";
    case "Email not confirmed":
      return "Confirme seu e-mail antes de entrar.";
    case "email rate limit exceeded":
      return "Muitos e-mails enviados em pouco tempo. Aguarde alguns minutos e tente novamente.";
    default:
      return "Não foi possível concluir. Tente novamente.";
  }
}

export async function signIn(
  email: string,
  password: string,
  redirectTo?: string
): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: translateAuthError(error.message) };
  }

  redirect(redirectTo || "/dashboard");
}

export async function signUp(
  name: string,
  email: string,
  password: string,
  redirectTo?: string
): Promise<SignUpResult> {
  const supabase = await createClient();
  const nextPath = redirectTo || "/onboarding";
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: name },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback?next=${encodeURIComponent(nextPath)}`,
    },
  });

  if (error) {
    return { error: translateAuthError(error.message) };
  }

  if (!data.session) {
    return { needsConfirmation: true };
  }

  redirect(nextPath);
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function createWorkspace(name: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("create_workspace", { workspace_name: name });

  if (error || !data) {
    return { error: error?.message ?? "Não foi possível criar o workspace." };
  }

  const cookieStore = await cookies();
  cookieStore.set(CURRENT_WORKSPACE_COOKIE, data.id, {
    path: "/",
    maxAge: WORKSPACE_COOKIE_MAX_AGE,
    sameSite: "lax",
  });

  redirect("/dashboard");
}

export async function switchWorkspace(workspaceId: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(CURRENT_WORKSPACE_COOKIE, workspaceId, {
    path: "/",
    maxAge: WORKSPACE_COOKIE_MAX_AGE,
    sameSite: "lax",
  });
}
