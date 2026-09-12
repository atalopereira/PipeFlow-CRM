"use client";

import * as React from "react";

import { ActivityForm } from "@/components/activity-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Activity } from "@/types/activity";

interface ActivityFormDialogProps {
  leadId: string;
  trigger: React.ReactNode;
  onSuccess?: (activity: Activity) => void;
}

export function ActivityFormDialog({ leadId, trigger, onSuccess }: ActivityFormDialogProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Registrar atividade</DialogTitle>
          <DialogDescription>Adicione uma nova atividade à timeline do lead.</DialogDescription>
        </DialogHeader>
        <ActivityForm
          leadId={leadId}
          onSuccess={(activity) => {
            setOpen(false);
            onSuccess?.(activity);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
