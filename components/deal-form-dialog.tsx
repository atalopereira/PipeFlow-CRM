"use client";

import * as React from "react";

import { DealForm } from "@/components/deal-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Deal } from "@/types/deal";

interface DealFormDialogProps {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSuccess?: (deal: Deal) => void;
}

export function DealFormDialog({
  trigger,
  open: openProp,
  onOpenChange,
  onSuccess,
}: DealFormDialogProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const isControlled = openProp !== undefined;
  const open = isControlled ? openProp : internalOpen;
  const setOpen = isControlled ? (onOpenChange ?? (() => {})) : setInternalOpen;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Novo negócio</DialogTitle>
          <DialogDescription>Cadastre um novo negócio no seu funil de vendas.</DialogDescription>
        </DialogHeader>
        <DealForm
          onSuccess={(deal) => {
            setOpen(false);
            onSuccess?.(deal);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
