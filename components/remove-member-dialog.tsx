"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { buttonVariants } from "@/components/ui/button";
import { useWorkspace } from "@/components/workspace-provider";
import { removeMember } from "@/lib/actions/workspace";
import { cn } from "@/lib/utils";

interface RemoveMemberDialogProps {
  userId: string;
  memberName: string;
  isSelf: boolean;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function RemoveMemberDialog({
  userId,
  memberName,
  isSelf,
  trigger,
  open: openProp,
  onOpenChange,
}: RemoveMemberDialogProps) {
  const router = useRouter();
  const { currentWorkspace } = useWorkspace();
  const [internalOpen, setInternalOpen] = React.useState(false);
  const [isRemoving, setIsRemoving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const isControlled = openProp !== undefined;
  const open = isControlled ? openProp : internalOpen;
  const setOpen = isControlled ? (onOpenChange ?? (() => {})) : setInternalOpen;

  async function handleConfirm() {
    setIsRemoving(true);
    setError(null);
    const result = await removeMember(currentWorkspace.id, userId);
    setIsRemoving(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    setOpen(false);
    if (isSelf) {
      router.push("/dashboard");
    }
    router.refresh();
  }

  return (
    <AlertDialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setError(null);
      }}
    >
      {trigger ? <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger> : null}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {isSelf ? "Sair do workspace" : "Remover colaborador"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {isSelf ? (
              <>
                Tem certeza que deseja sair de <strong>{currentWorkspace.name}</strong>? Você
                perderá acesso aos dados deste workspace.
              </>
            ) : (
              <>
                Tem certeza que deseja remover <strong>{memberName}</strong> de{" "}
                <strong>{currentWorkspace.name}</strong>? Essa ação não pode ser desfeita.
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            className={cn(buttonVariants({ variant: "destructive" }))}
            disabled={isRemoving}
            onClick={(event) => {
              event.preventDefault();
              void handleConfirm();
            }}
          >
            {isRemoving ? "Removendo..." : isSelf ? "Sair" : "Remover"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
