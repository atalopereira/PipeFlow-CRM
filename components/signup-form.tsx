"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { MailCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { signUp } from "@/lib/actions/auth";
import { PasswordInput } from "@/components/password-input";
import { SubmitButton } from "@/components/submit-button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const signupSchema = z
  .object({
    name: z.string().min(2, "Informe seu nome completo"),
    email: z.string().min(1, "Informe seu e-mail").email("E-mail inválido"),
    password: z.string().min(8, "A senha deve ter no mínimo 8 caracteres"),
    confirmPassword: z.string().min(1, "Confirme sua senha"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

type SignupValues = z.infer<typeof signupSchema>;

interface SignupFormProps {
  redirectTo?: string;
}

export function SignupForm({ redirectTo }: SignupFormProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [formError, setFormError] = React.useState<string | null>(null);
  const [confirmationEmail, setConfirmationEmail] = React.useState<string | null>(null);

  const form = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  async function onSubmit(values: SignupValues) {
    setFormError(null);
    setIsSubmitting(true);
    const result = await signUp(values.name, values.email, values.password, redirectTo);
    if (result?.error) {
      setFormError(result.error);
      setIsSubmitting(false);
      return;
    }
    if (result?.needsConfirmation) {
      setConfirmationEmail(values.email);
      setIsSubmitting(false);
    }
  }

  if (confirmationEmail) {
    return (
      <div className="flex flex-col items-center gap-3 py-2 text-center">
        <MailCheck className="h-10 w-10 text-primary" />
        <p className="text-sm text-muted-foreground">
          Enviamos um link de confirmação para{" "}
          <span className="font-medium text-foreground">{confirmationEmail}</span>. Clique no link
          para ativar sua conta e continuar.
        </p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-4">
        {formError ? (
          <Alert variant="destructive">
            <AlertDescription>{formError}</AlertDescription>
          </Alert>
        ) : null}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome completo</FormLabel>
              <FormControl>
                <Input placeholder="Seu nome" autoComplete="name" {...field} />
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
                <Input
                  type="email"
                  placeholder="voce@empresa.com"
                  autoComplete="email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <PasswordInput autoComplete="new-password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirmar senha</FormLabel>
              <FormControl>
                <PasswordInput autoComplete="new-password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <SubmitButton className="w-full" loading={isSubmitting} loadingText="Criando conta...">
          Criar conta
        </SubmitButton>
      </form>
    </Form>
  );
}
