import { AuthShell } from "@/components/auth-shell";
import { LoginForm } from "@/components/login-form";

interface LoginPageProps {
  searchParams: { invite?: string };
}

export default function LoginPage({ searchParams }: LoginPageProps) {
  const invite = searchParams.invite;
  const redirectTo = invite ? `/invite/${invite}` : undefined;

  return (
    <AuthShell
      title="Entrar"
      description="Acesse seu workspace do PipeFlow CRM"
      footer={{
        text: "Ainda não tem uma conta?",
        linkLabel: "Criar conta",
        linkHref: invite ? `/signup?invite=${invite}` : "/signup",
      }}
    >
      <LoginForm redirectTo={redirectTo} />
    </AuthShell>
  );
}
