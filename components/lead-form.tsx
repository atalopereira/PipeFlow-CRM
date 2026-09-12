"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { parseEstimatedValue, useLeads } from "@/components/leads-provider";
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
import {
  DEFAULT_LEAD_STATUS_ID,
  LEAD_STATUSES,
  LEAD_STATUS_IDS,
} from "@/lib/constants/lead-status";
import type { Lead } from "@/types/lead";

const leadFormSchema = z.object({
  name: z.string().trim().min(2, "Informe o nome do lead"),
  email: z.string().trim().min(1, "Informe o e-mail").email("E-mail inválido"),
  phone: z.string().trim().min(8, "Informe um telefone válido"),
  company: z.string().trim().min(1, "Informe a empresa"),
  role: z.string().trim(),
  statusId: z.enum(LEAD_STATUS_IDS),
  estimatedValue: z
    .string()
    .trim()
    .optional()
    .refine((val) => !val || !Number.isNaN(Number(val)), "Informe um valor numérico válido"),
  notes: z.string().trim().optional(),
});

export type LeadFormValues = z.infer<typeof leadFormSchema>;

interface LeadFormProps {
  mode: "create" | "edit";
  lead?: Lead;
  onSuccess: (lead: Lead) => void;
}

export function LeadForm({ mode, lead, onSuccess }: LeadFormProps) {
  const { addLead, updateLead, getLeadById } = useLeads();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

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

  function onSubmit(values: LeadFormValues) {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      if (mode === "create") {
        onSuccess(addLead(values));
      } else if (lead) {
        updateLead(lead.id, values);
        onSuccess(
          getLeadById(lead.id) ?? {
            ...lead,
            ...values,
            estimatedValue: parseEstimatedValue(values.estimatedValue),
          }
        );
      }
    }, 600);
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
