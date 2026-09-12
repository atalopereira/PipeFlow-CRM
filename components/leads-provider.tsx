"use client";

import * as React from "react";

import { MOCK_ACTIVITIES } from "@/lib/mock/activities";
import { MOCK_LEADS } from "@/lib/mock/leads";
import { MOCK_CURRENT_USER } from "@/lib/mock/workspace";
import type { Activity } from "@/types/activity";
import type { Lead } from "@/types/lead";
import type { ActivityFormValues } from "@/components/activity-form";
import type { LeadFormValues } from "@/components/lead-form";

interface LeadsContextValue {
  leads: Lead[];
  addLead: (input: LeadFormValues) => Lead;
  updateLead: (id: string, input: LeadFormValues) => void;
  deleteLead: (id: string) => void;
  getLeadById: (id: string) => Lead | undefined;
  activities: Activity[];
  addActivity: (leadId: string, input: ActivityFormValues) => Activity;
  getActivitiesByLeadId: (leadId: string) => Activity[];
}

const LeadsContext = React.createContext<LeadsContextValue | null>(null);

export function parseEstimatedValue(value: string | undefined): number | undefined {
  return value ? Number(value) : undefined;
}

export function LeadsProvider({ children }: { children: React.ReactNode }) {
  const [leads, setLeads] = React.useState<Lead[]>(MOCK_LEADS);
  const [activities, setActivities] = React.useState<Activity[]>(MOCK_ACTIVITIES);

  const addLead = React.useCallback((input: LeadFormValues): Lead => {
    const newLead: Lead = {
      ...input,
      estimatedValue: parseEstimatedValue(input.estimatedValue),
      id: `lead_${crypto.randomUUID()}`,
      owner: { name: MOCK_CURRENT_USER.name, initials: MOCK_CURRENT_USER.initials },
      createdAt: new Date().toISOString(),
    };
    setLeads((prev) => [newLead, ...prev]);
    return newLead;
  }, []);

  const updateLead = React.useCallback((id: string, input: LeadFormValues) => {
    setLeads((prev) =>
      prev.map((lead) =>
        lead.id === id
          ? { ...lead, ...input, estimatedValue: parseEstimatedValue(input.estimatedValue) }
          : lead
      )
    );
  }, []);

  const deleteLead = React.useCallback((id: string) => {
    setLeads((prev) => prev.filter((lead) => lead.id !== id));
  }, []);

  const getLeadById = React.useCallback(
    (id: string) => leads.find((lead) => lead.id === id),
    [leads]
  );

  const addActivity = React.useCallback((leadId: string, input: ActivityFormValues): Activity => {
    const newActivity: Activity = {
      ...input,
      id: `activity_${crypto.randomUUID()}`,
      leadId,
      author: MOCK_CURRENT_USER.name,
    };
    setActivities((prev) => [newActivity, ...prev]);
    return newActivity;
  }, []);

  const getActivitiesByLeadId = React.useCallback(
    (leadId: string) => activities.filter((activity) => activity.leadId === leadId),
    [activities]
  );

  const value = React.useMemo(
    () => ({
      leads,
      addLead,
      updateLead,
      deleteLead,
      getLeadById,
      activities,
      addActivity,
      getActivitiesByLeadId,
    }),
    [
      leads,
      addLead,
      updateLead,
      deleteLead,
      getLeadById,
      activities,
      addActivity,
      getActivitiesByLeadId,
    ]
  );

  return <LeadsContext.Provider value={value}>{children}</LeadsContext.Provider>;
}

export function useLeads(): LeadsContextValue {
  const context = React.useContext(LeadsContext);
  if (!context) {
    throw new Error("useLeads must be used within a LeadsProvider");
  }
  return context;
}
