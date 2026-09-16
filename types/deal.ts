import type { PipelineStageId } from "@/lib/constants/pipeline";
import type { LeadOwner } from "@/types/lead";

export interface Deal {
  id: string;
  title: string;
  leadId: string;
  value: number;
  stageId: PipelineStageId;
  owner: LeadOwner;
  dueDate: string;
  createdAt: string;
}
