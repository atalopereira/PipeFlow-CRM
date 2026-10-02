import { z } from "zod";

export const inviteMemberSchema = z.object({
  email: z.string().trim().min(1, "Informe o e-mail").email("E-mail inválido"),
  role: z.enum(["admin", "member"]),
});

export type InviteMemberValues = z.infer<typeof inviteMemberSchema>;
