import { AuthShell } from "@/components/auth-shell";
import { SignupForm } from "@/components/signup-form";

interface SignupPageProps {
  searchParams: { invite?: string };
}

export default function SignupPage({ searchParams }: SignupPageProps) {
  const invite = searchParams.invite;
  const redirectTo = invite ? `/invite/${invite}` : undefined;

  return (
    <AuthShell
      title="Criar conta"
      description="Comece a organizar seu pipeline de vendas"
      footer={{
        text: "Já tem uma conta?",
        linkLabel: "Entrar",
        linkHref: invite ? `/login?invite=${invite}` : "/login",
      }}
    >
      <SignupForm redirectTo={redirectTo} />
    </AuthShell>
  );
}
