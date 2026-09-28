"use client";

import * as React from "react";

import { ActivityForm, type ActivityFormValues } from "@/components/activity-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ActivityFormDialogProps {
  leadId: string;
  trigger: React.ReactNode;
  onAddActivity: (leadId: string, input: ActivityFormValues) => Promise<{ error?: string }>;
  onSuccess?: () => void;
}

export function ActivityFormDialog({
  leadId,
  trigger,
  onAddActivity,
  onSuccess,
}: ActivityFormDialogProps) {
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
          onAddActivity={onAddActivity}
          onSuccess={() => {
            setOpen(false);
            onSuccess?.();
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
