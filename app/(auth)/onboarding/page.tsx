import { AuthShell } from "@/components/auth-shell";
import { OnboardingForm } from "@/components/onboarding-form";

export default function OnboardingPage() {
  return (
    <AuthShell
      title="Crie seu primeiro workspace"
      description="Um workspace organiza seus leads, pipeline e equipe"
    >
      <OnboardingForm />
    </AuthShell>
  );
}
