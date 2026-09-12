import type { ReactNode } from "react";

import { LeadsProvider } from "@/components/leads-provider";

export default function LeadsLayout({ children }: { children: ReactNode }) {
  return <LeadsProvider>{children}</LeadsProvider>;
}
