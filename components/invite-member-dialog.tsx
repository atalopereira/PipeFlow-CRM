"use client";

import * as React from "react";

import { InviteMemberForm } from "@/components/invite-member-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface InviteMemberDialogProps {
  trigger: React.ReactNode;
}

export function InviteMemberDialog({ trigger }: InviteMemberDialogProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Convidar colaborador</DialogTitle>
          <DialogDescription>
            Enviamos um e-mail com um link de convite para o seu workspace.
          </DialogDescription>
        </DialogHeader>
        <InviteMemberForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
