"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useLeads } from "@/components/leads-provider";
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
import { ACTIVITY_TYPES, ACTIVITY_TYPE_IDS } from "@/lib/constants/activity-type";
import type { Activity } from "@/types/activity";

const activityFormSchema = z.object({
  type: z.enum(ACTIVITY_TYPE_IDS),
  title: z.string().trim().min(2, "Informe um título"),
  description: z.string().trim().min(1, "Informe uma descrição"),
  date: z.string().min(1, "Informe a data"),
});

export type ActivityFormValues = z.infer<typeof activityFormSchema>;

function toDatetimeLocalValue(date: Date): string {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

interface ActivityFormProps {
  leadId: string;
  onSuccess: (activity: Activity) => void;
}

export function ActivityForm({ leadId, onSuccess }: ActivityFormProps) {
  const { addActivity } = useLeads();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<ActivityFormValues>({
    resolver: zodResolver(activityFormSchema),
    defaultValues: {
      type: "ligacao",
      title: "",
      description: "",
      date: toDatetimeLocalValue(new Date()),
    },
  });

  function onSubmit(values: ActivityFormValues) {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onSuccess(
        addActivity(leadId, {
          ...values,
          date: new Date(values.date).toISOString(),
        })
      );
    }, 600);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {ACTIVITY_TYPES.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.label}
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
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>Título</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Ligação de prospecção" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>Descrição</FormLabel>
                <FormControl>
                  <Textarea placeholder="Detalhes da atividade" rows={3} {...field} />
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
          <SubmitButton loading={isSubmitting} loadingText="Registrando...">
            Registrar atividade
          </SubmitButton>
        </DialogFooter>
      </form>
    </Form>
  );
}
