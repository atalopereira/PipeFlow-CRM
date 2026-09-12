import type { LeadStatusId } from "@/lib/constants/lead-status";

export interface LeadOwner {
  name: string;
  initials: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  role: string;
  statusId: LeadStatusId;
  owner: LeadOwner;
  createdAt: string;
  estimatedValue?: number;
  notes?: string;
}
