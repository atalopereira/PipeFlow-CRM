// Hand-authored to match supabase/migrations/*.sql. Once the Supabase CLI is
// linked to the project, regenerate the authoritative version with:
//   supabase gen types typescript --project-id <ref> > types/supabase.ts

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          created_at: string;
        };
        Insert: {
          id: string;
          full_name?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      workspaces: {
        Row: {
          id: string;
          name: string;
          plan: "free" | "pro";
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          plan?: "free" | "pro";
          created_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          plan?: "free" | "pro";
          created_by?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      workspace_members: {
        Row: {
          workspace_id: string;
          user_id: string;
          role: "admin" | "member";
          created_at: string;
        };
        Insert: {
          workspace_id: string;
          user_id: string;
          role?: "admin" | "member";
          created_at?: string;
        };
        Update: {
          workspace_id?: string;
          user_id?: string;
          role?: "admin" | "member";
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "workspace_members_workspace_id_fkey";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          },
        ];
      };
      leads: {
        Row: {
          id: string;
          workspace_id: string;
          owner_id: string;
          name: string;
          email: string;
          phone: string | null;
          company: string | null;
          role: string | null;
          status_id: "novo" | "em_contato" | "qualificado" | "descartado";
          estimated_value: number | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          workspace_id: string;
          owner_id: string;
          name: string;
          email: string;
          phone?: string | null;
          company?: string | null;
          role?: string | null;
          status_id?: "novo" | "em_contato" | "qualificado" | "descartado";
          estimated_value?: number | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          workspace_id?: string;
          owner_id?: string;
          name?: string;
          email?: string;
          phone?: string | null;
          company?: string | null;
          role?: string | null;
          status_id?: "novo" | "em_contato" | "qualificado" | "descartado";
          estimated_value?: number | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "leads_workspace_id_fkey";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "leads_owner_id_fkey";
            columns: ["owner_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      deals: {
        Row: {
          id: string;
          workspace_id: string;
          lead_id: string;
          owner_id: string;
          title: string;
          value: number;
          stage_id:
            | "novo_lead"
            | "contato_realizado"
            | "proposta_enviada"
            | "negociacao"
            | "fechado_ganho"
            | "fechado_perdido";
          due_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          workspace_id: string;
          lead_id: string;
          owner_id: string;
          title: string;
          value?: number;
          stage_id?:
            | "novo_lead"
            | "contato_realizado"
            | "proposta_enviada"
            | "negociacao"
            | "fechado_ganho"
            | "fechado_perdido";
          due_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          workspace_id?: string;
          lead_id?: string;
          owner_id?: string;
          title?: string;
          value?: number;
          stage_id?:
            | "novo_lead"
            | "contato_realizado"
            | "proposta_enviada"
            | "negociacao"
            | "fechado_ganho"
            | "fechado_perdido";
          due_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "deals_workspace_id_fkey";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "deals_lead_id_fkey";
            columns: ["lead_id"];
            isOneToOne: false;
            referencedRelation: "leads";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "deals_owner_id_fkey";
            columns: ["owner_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      activities: {
        Row: {
          id: string;
          workspace_id: string;
          lead_id: string;
          author_id: string;
          type: "ligacao" | "email" | "reuniao" | "nota";
          title: string;
          description: string | null;
          occurred_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          workspace_id: string;
          lead_id: string;
          author_id: string;
          type: "ligacao" | "email" | "reuniao" | "nota";
          title: string;
          description?: string | null;
          occurred_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          workspace_id?: string;
          lead_id?: string;
          author_id?: string;
          type?: "ligacao" | "email" | "reuniao" | "nota";
          title?: string;
          description?: string | null;
          occurred_at?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "activities_workspace_id_fkey";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "activities_lead_id_fkey";
            columns: ["lead_id"];
            isOneToOne: false;
            referencedRelation: "leads";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "activities_author_id_fkey";
            columns: ["author_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      subscriptions: {
        Row: {
          id: string;
          workspace_id: string;
          stripe_customer_id: string | null;
          stripe_subscription_id: string | null;
          status: "inactive" | "trialing" | "active" | "past_due" | "canceled";
          plan: "free" | "pro";
          current_period_end: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          workspace_id: string;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          status?: "inactive" | "trialing" | "active" | "past_due" | "canceled";
          plan?: "free" | "pro";
          current_period_end?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          workspace_id?: string;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          status?: "inactive" | "trialing" | "active" | "past_due" | "canceled";
          plan?: "free" | "pro";
          current_period_end?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "subscriptions_workspace_id_fkey";
            columns: ["workspace_id"];
            isOneToOne: true;
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: {
      create_workspace: {
        Args: { workspace_name: string };
        Returns: Database["public"]["Tables"]["workspaces"]["Row"];
      };
      is_workspace_member: {
        Args: { ws_id: string };
        Returns: boolean;
      };
      is_workspace_admin: {
        Args: { ws_id: string };
        Returns: boolean;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Workspace = Database["public"]["Tables"]["workspaces"]["Row"];
export type WorkspaceMember = Database["public"]["Tables"]["workspace_members"]["Row"];
export type LeadRow = Database["public"]["Tables"]["leads"]["Row"];
export type DealRow = Database["public"]["Tables"]["deals"]["Row"];
export type ActivityRow = Database["public"]["Tables"]["activities"]["Row"];
export type Subscription = Database["public"]["Tables"]["subscriptions"]["Row"];
