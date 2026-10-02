"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { SubmitButton } from "@/components/submit-button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { acceptInvite } from "@/lib/actions/workspace";

interface AcceptInviteFormProps {
  token: string;
  alreadyAccepted?: boolean;
}

export function AcceptInviteForm({ token, alreadyAccepted }: AcceptInviteFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function handleAccept() {
    setIsSubmitting(true);
    setError(null);

    const result = await acceptInvite(token);

    if (result.error) {
      setError(result.error);
      setIsSubmitting(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-3">
      {error ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}
      <SubmitButton
        type="button"
        className="w-full"
        loading={isSubmitting}
        loadingText="Entrando..."
        onClick={() => void handleAccept()}
      >
        {alreadyAccepted ? "Ir para o workspace" : "Aceitar convite"}
      </SubmitButton>
    </div>
  );
}
