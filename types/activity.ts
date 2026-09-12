export type ActivityType = "ligacao" | "email" | "reuniao" | "nota";

export interface Activity {
  id: string;
  leadId: string;
  type: ActivityType;
  title: string;
  author: string;
  description: string;
  date: string;
}
