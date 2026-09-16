import type { ReactNode } from "react";

import { DealsProvider } from "@/components/deals-provider";

export default function PipelineLayout({ children }: { children: ReactNode }) {
  return <DealsProvider>{children}</DealsProvider>;
}
