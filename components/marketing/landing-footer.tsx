import Link from "next/link";

import { BrandLogo } from "@/components/brand-logo";

const FOOTER_LINKS = [
  { label: "Funcionalidades", href: "#funcionalidades" },
  { label: "Preços", href: "#precos" },
  { label: "Login", href: "/login" },
];

export function LandingFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col items-center gap-1 sm:items-start">
          <BrandLogo />
          <p className="text-xs text-muted-foreground">
            CRM visual de pipeline para pequenas e médias equipes de vendas.
          </p>
        </div>

        <div className="flex flex-col items-center gap-4 sm:items-end">
          <nav className="flex items-center gap-4">
            {FOOTER_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} PipeFlow CRM. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
