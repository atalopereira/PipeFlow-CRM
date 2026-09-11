import { AuthShell } from "@/components/auth-shell";
import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <AuthShell
      title="Entrar"
      description="Acesse seu workspace do PipeFlow CRM"
      footer={{ text: "Ainda não tem uma conta?", linkLabel: "Criar conta", linkHref: "/signup" }}
    >
      <LoginForm />
    </AuthShell>
  );
}
