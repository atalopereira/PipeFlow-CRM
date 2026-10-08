import type { WorkspacePlan } from "@/types/workspace";

export const FREE_PLAN_LEAD_LIMIT = 50;
export const FREE_PLAN_MEMBER_LIMIT = 2;

export interface LimitStatus {
  allowed: boolean;
  limit: number | null;
  current: number;
}

export function canAddLead(plan: WorkspacePlan, currentLeadCount: number): LimitStatus {
  if (plan === "pro") {
    return { allowed: true, limit: null, current: currentLeadCount };
  }
  return {
    allowed: currentLeadCount < FREE_PLAN_LEAD_LIMIT,
    limit: FREE_PLAN_LEAD_LIMIT,
    current: currentLeadCount,
  };
}

// currentMemberCount should include pending invites, matching how
// invite_member() counts toward the limit in the database.
export function canAddMember(plan: WorkspacePlan, currentMemberCount: number): LimitStatus {
  if (plan === "pro") {
    return { allowed: true, limit: null, current: currentMemberCount };
  }
  return {
    allowed: currentMemberCount < FREE_PLAN_MEMBER_LIMIT,
    limit: FREE_PLAN_MEMBER_LIMIT,
    current: currentMemberCount,
  };
}
