import Link from "next/link";

import { AcceptInviteForm } from "@/components/accept-invite-form";
import { AuthShell } from "@/components/auth-shell";
import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/actions/auth";
import { createClient } from "@/lib/supabase/server";

interface InvitePageProps {
  params: { token: string };
}

function InviteNotice({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children?: React.ReactNode;
}) {
  return (
    <AuthShell title={title} description={description}>
      {children ?? (
        <Button asChild className="w-full">
          <Link href="/login">Ir para o login</Link>
        </Button>
      )}
    </AuthShell>
  );
}

export default async function InvitePage({ params }: InvitePageProps) {
  const supabase = await createClient();

  const { data: preview } = await supabase
    .rpc("get_invite_preview", { p_token: params.token })
    .maybeSingle();

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!preview) {
    return (
      <InviteNotice
        title="Convite inválido"
        description="Este link de convite não existe ou já foi usado."
      />
    );
  }

  const roleLabel = preview.role === "admin" ? "Administrador" : "Membro";

  if (preview.status === "revoked") {
    return (
      <InviteNotice
        title="Convite revogado"
        description={`O convite para ${preview.workspace_name} não está mais disponível.`}
      />
    );
  }

  if (preview.status === "pending" && new Date(preview.expires_at) < new Date()) {
    return (
      <InviteNotice
        title="Convite expirado"
        description="Peça para um administrador enviar um novo convite."
      />
    );
  }

  if (!authUser) {
    return (
      <InviteNotice
        title={`Convite para ${preview.workspace_name}`}
        description={`Você foi convidado como ${roleLabel}. Crie uma conta ou entre com ${preview.email} para continuar.`}
      >
        <div className="flex flex-col gap-2">
          <Button asChild className="w-full">
            <Link href={`/signup?invite=${params.token}`}>Criar conta</Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href={`/login?invite=${params.token}`}>Já tenho uma conta</Link>
          </Button>
        </div>
      </InviteNotice>
    );
  }

  if (authUser.email?.toLowerCase() !== preview.email.toLowerCase()) {
    return (
      <InviteNotice
        title="Convite para outro e-mail"
        description={`Este convite foi enviado para ${preview.email}, mas você está logado como ${authUser.email}.`}
      >
        <form action={signOut}>
          <Button type="submit" variant="outline" className="w-full">
            Sair e entrar com outra conta
          </Button>
        </form>
      </InviteNotice>
    );
  }

  const alreadyAccepted = preview.status === "accepted";

  return (
    <AuthShell
      title={alreadyAccepted ? "Convite já aceito" : `Convite para ${preview.workspace_name}`}
      description={
        alreadyAccepted
          ? "Você já faz parte deste workspace."
          : `Você foi convidado como ${roleLabel} em ${preview.workspace_name}.`
      }
    >
      <AcceptInviteForm token={params.token} alreadyAccepted={alreadyAccepted} />
    </AuthShell>
  );
}
