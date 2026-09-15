import Link from "next/link";

import { BrandLogo } from "@/components/brand-logo";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";

interface AuthShellProps {
  title: string;
  description: string;
  children: React.ReactNode;
  footer?: {
    text: string;
    linkLabel: string;
    linkHref: string;
  };
}

export function AuthShell({ title, description, children, footer }: AuthShellProps) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-8 bg-muted/40 p-4">
      <BrandLogo className="text-lg" />
      <Card className="w-full max-w-sm">
        <CardHeader>
          <h1 className="font-display text-xl font-semibold leading-none tracking-tight">
            {title}
          </h1>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
      {footer ? (
        <p className="text-sm text-muted-foreground">
          {footer.text}{" "}
          <Link href={footer.linkHref} className="font-medium text-primary hover:underline">
            {footer.linkLabel}
          </Link>
        </p>
      ) : null}
    </div>
  );
}
