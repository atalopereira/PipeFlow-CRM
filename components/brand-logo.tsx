import Link from "next/link";

import { cn } from "@/lib/utils";

interface BrandLogoProps {
  className?: string;
}

export function BrandLogo({ className }: BrandLogoProps) {
  return (
    <Link
      href="/dashboard"
      className={cn("relative inline-flex font-display font-extrabold", className)}
    >
      Pipe<span className="text-primary">Flow</span>
      <span
        aria-hidden
        className="absolute -bottom-1 left-0 h-[3px] w-full origin-center animate-flowPulse rounded-full bg-gradient-to-r from-transparent via-primary to-transparent"
      />
    </Link>
  );
}
