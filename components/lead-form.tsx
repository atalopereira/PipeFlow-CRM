"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { createLead, updateLead } from "@/lib/actions/leads";
import { leadFormSchema, type LeadFormValues } from "@/lib/validations/lead";
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
import { Textarea } from "@/components/ui/textarea";
import { DEFAULT_LEAD_STATUS_ID, LEAD_STATUSES } from "@/lib/constants/lead-status";
import type { Lead } from "@/types/lead";

export type { LeadFormValues };

interface LeadFormProps {
  mode: "create" | "edit";
  lead?: Lead;
  onSuccess: (leadId: string) => void;
}

export function LeadForm({ mode, lead, onSuccess }: LeadFormProps) {
  const router = useRouter();
  const { currentWorkspace } = useWorkspace();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [formError, setFormError] = React.useState<string | null>(null);

  const form = useForm<LeadFormValues>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      name: lead?.name ?? "",
      email: lead?.email ?? "",
      phone: lead?.phone ?? "",
      company: lead?.company ?? "",
      role: lead?.role ?? "",
      statusId: lead?.statusId ?? DEFAULT_LEAD_STATUS_ID,
      estimatedValue: lead?.estimatedValue ? String(lead.estimatedValue) : "",
      notes: lead?.notes ?? "",
    },
  });

  async function onSubmit(values: LeadFormValues) {
    setIsSubmitting(true);
    setFormError(null);

    const result =
      mode === "create"
        ? await createLead(currentWorkspace.id, values)
        : await updateLead(currentWorkspace.id, lead!.id, values);

    setIsSubmitting(false);

    if (result.error || !result.leadId) {
      setFormError(result.error ?? "Não foi possível salvar o lead.");
      return;
    }

    router.refresh();
    onSuccess(result.leadId);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input placeholder="Nome do lead" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="nome@empresa.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone</FormLabel>
                <FormControl>
                  <Input placeholder="(11) 98765-4321" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="company"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Empresa</FormLabel>
                <FormControl>
                  <Input placeholder="Nome da empresa" {...field} />
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
                <FormLabel>Cargo</FormLabel>
                <FormControl>
                  <Input placeholder="Cargo (opcional)" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="statusId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {LEAD_STATUSES.map((status) => (
                      <SelectItem key={status.id} value={status.id}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="estimatedValue"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>Valor estimado (R$)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Ex: 48000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>Notas</FormLabel>
                <FormControl>
                  <Textarea placeholder="Observações sobre o lead (opcional)" rows={3} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {formError ? <p className="text-sm text-destructive">{formError}</p> : null}
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancelar
            </Button>
          </DialogClose>
          <SubmitButton
            loading={isSubmitting}
            loadingText={mode === "create" ? "Salvando..." : "Atualizando..."}
          >
            {mode === "create" ? "Criar lead" : "Salvar alterações"}
          </SubmitButton>
        </DialogFooter>
      </form>
    </Form>
  );
}
