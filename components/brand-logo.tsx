import Link from "next/link";
import { Waypoints } from "lucide-react";

import { cn } from "@/lib/utils";

interface BrandLogoProps {
  className?: string;
}

export function BrandLogo({ className }: BrandLogoProps) {
  return (
    <Link href="/dashboard" className={cn("flex items-center gap-2 font-semibold", className)}>
      <Waypoints className="h-5 w-5 text-primary" />
      PipeFlow
    </Link>
  );
}
