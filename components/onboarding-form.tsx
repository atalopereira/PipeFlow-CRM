"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { SubmitButton } from "@/components/submit-button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const onboardingSchema = z.object({
  workspaceName: z.string().min(2, "Informe um nome para o workspace"),
});

type OnboardingValues = z.infer<typeof onboardingSchema>;

export function OnboardingForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<OnboardingValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: { workspaceName: "" },
  });

  function onSubmit() {
    setIsSubmitting(true);
    setTimeout(() => {
      router.push("/dashboard");
    }, 600);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-4">
        <FormField
          control={form.control}
          name="workspaceName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do workspace</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Acme Vendas" autoComplete="organization" {...field} />
              </FormControl>
              <FormDescription>
                É como sua equipe vai identificar essa conta. Dá pra mudar depois.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <SubmitButton className="w-full" loading={isSubmitting} loadingText="Criando workspace...">
          Criar workspace e continuar
        </SubmitButton>
      </form>
    </Form>
  );
}
