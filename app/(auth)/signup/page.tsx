import { AuthShell } from "@/components/auth-shell";
import { SignupForm } from "@/components/signup-form";

export default function SignupPage() {
  return (
    <AuthShell
      title="Criar conta"
      description="Comece a organizar seu pipeline de vendas"
      footer={{ text: "Já tem uma conta?", linkLabel: "Entrar", linkHref: "/login" }}
    >
      <SignupForm />
    </AuthShell>
  );
}
