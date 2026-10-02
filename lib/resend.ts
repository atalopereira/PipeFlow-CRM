import { Resend } from "resend";

import type { WorkspaceRole } from "@/lib/constants/workspace-role";

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "PipeFlow CRM <onboarding@resend.dev>";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

interface SendWorkspaceInviteEmailInput {
  to: string;
  workspaceName: string;
  role: WorkspaceRole;
  token: string;
}

export async function sendWorkspaceInviteEmail({
  to,
  workspaceName,
  role,
  token,
}: SendWorkspaceInviteEmailInput): Promise<void> {
  if (!resend) {
    console.warn(
      "RESEND_API_KEY não configurada — convite criado sem envio de e-mail. Link:",
      `${process.env.NEXT_PUBLIC_APP_URL}/invite/${token}`
    );
    return;
  }

  const roleLabel = role === "admin" ? "Administrador" : "Membro";
  const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL}/invite/${token}`;
  const safeWorkspaceName = escapeHtml(workspaceName);

  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: `Você foi convidado para o workspace ${workspaceName} no PipeFlow CRM`,
    html: `
      <p>Você foi convidado para colaborar no workspace <strong>${safeWorkspaceName}</strong> no PipeFlow CRM, como <strong>${roleLabel}</strong>.</p>
      <p><a href="${inviteUrl}">Clique aqui para aceitar o convite</a></p>
      <p>Se você não esperava este e-mail, pode ignorá-lo.</p>
    `,
  });

  if (error) {
    console.error("Falha ao enviar e-mail de convite:", error.message);
  }
}
