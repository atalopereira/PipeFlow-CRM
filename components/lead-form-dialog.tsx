"use client";

import * as React from "react";

import { LeadForm } from "@/components/lead-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Lead } from "@/types/lead";

interface LeadFormDialogProps {
  mode: "create" | "edit";
  lead?: Lead;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSuccess?: (lead: Lead) => void;
}

export function LeadFormDialog({
  mode,
  lead,
  trigger,
  open: openProp,
  onOpenChange,
  onSuccess,
}: LeadFormDialogProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const isControlled = openProp !== undefined;
  const open = isControlled ? openProp : internalOpen;
  const setOpen = isControlled ? (onOpenChange ?? (() => {})) : setInternalOpen;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Novo lead" : "Editar lead"}</DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Cadastre um novo lead no seu workspace."
              : "Atualize as informações do lead."}
          </DialogDescription>
        </DialogHeader>
        <LeadForm
          mode={mode}
          lead={lead}
          onSuccess={(result) => {
            setOpen(false);
            onSuccess?.(result);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
