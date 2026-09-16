"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useDeals } from "@/components/deals-provider";
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
import {
  DEFAULT_PIPELINE_STAGE_ID,
  PIPELINE_STAGES,
  PIPELINE_STAGE_IDS,
} from "@/lib/constants/pipeline";
import { MOCK_LEADS } from "@/lib/mock/leads";
import type { Deal } from "@/types/deal";

const dealFormSchema = z.object({
  title: z.string().trim().min(2, "Informe o nome do negócio"),
  leadId: z.string().min(1, "Selecione um lead"),
  value: z
    .string()
    .trim()
    .min(1, "Informe o valor")
    .refine(
      (val) => !Number.isNaN(Number(val)) && Number(val) > 0,
      "Informe um valor numérico válido"
    ),
  stageId: z.enum(PIPELINE_STAGE_IDS),
  dueDate: z.string().min(1, "Informe o prazo"),
});

export type DealFormValues = z.infer<typeof dealFormSchema>;

interface DealFormProps {
  onSuccess: (deal: Deal) => void;
}

export function DealForm({ onSuccess }: DealFormProps) {
  const { addDeal } = useDeals();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<DealFormValues>({
    resolver: zodResolver(dealFormSchema),
    defaultValues: {
      title: "",
      leadId: "",
      value: "",
      stageId: DEFAULT_PIPELINE_STAGE_ID,
      dueDate: "",
    },
  });

  function onSubmit(values: DealFormValues) {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onSuccess(addDeal(values));
    }, 600);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>Título do negócio</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Implantação plano Enterprise" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="leadId"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>Lead vinculado</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um lead" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {MOCK_LEADS.map((lead) => (
                      <SelectItem key={lead.id} value={lead.id}>
                        {lead.name} · {lead.company}
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
            name="value"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor (R$)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Ex: 48000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="stageId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Etapa</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {PIPELINE_STAGES.map((stage) => (
                      <SelectItem key={stage.id} value={stage.id}>
                        {stage.label}
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
            name="dueDate"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>Prazo</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
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
          <SubmitButton loading={isSubmitting} loadingText="Salvando...">
            Criar negócio
          </SubmitButton>
        </DialogFooter>
      </form>
    </Form>
  );
}
