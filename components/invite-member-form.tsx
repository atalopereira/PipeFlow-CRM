"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { inviteMember } from "@/lib/actions/workspace";
import { inviteMemberSchema, type InviteMemberValues } from "@/lib/validations/workspace-member";
import { useWorkspace } from "@/components/workspace-provider";
import { SubmitButton } from "@/components/submit-button";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { WORKSPACE_ROLES } from "@/lib/constants/workspace-role";

interface InviteMemberFormProps {
  onSuccess: () => void;
}

export function InviteMemberForm({ onSuccess }: InviteMemberFormProps) {
  const router = useRouter();
  const { currentWorkspace } = useWorkspace();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [formError, setFormError] = React.useState<string | null>(null);

  const form = useForm<InviteMemberValues>({
    resolver: zodResolver(inviteMemberSchema),
    defaultValues: { email: "", role: "member" },
  });

  async function onSubmit(values: InviteMemberValues) {
    setIsSubmitting(true);
    setFormError(null);

    const result = await inviteMember(currentWorkspace.id, currentWorkspace.name, values);

    setIsSubmitting(false);

    if (result.error) {
      setFormError(result.error);
      return;
    }

    form.reset({ email: "", role: "member" });
    router.refresh();
    onSuccess();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-mail</FormLabel>
              <FormControl>
                <Input type="email" placeholder="colaborador@empresa.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Papel</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {WORKSPACE_ROLES.map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        {formError ? <p className="text-sm text-destructive">{formError}</p> : null}
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancelar
            </Button>
          </DialogClose>
          <SubmitButton loading={isSubmitting} loadingText="Enviando...">
            Enviar convite
          </SubmitButton>
        </DialogFooter>
      </form>
    </Form>
  );
}
