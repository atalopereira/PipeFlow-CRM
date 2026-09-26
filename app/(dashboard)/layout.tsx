import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { AppSidebar } from "@/components/app-sidebar";
import { AppTopbar } from "@/components/app-topbar";
import { WorkspaceProvider, type WorkspaceSummary } from "@/components/workspace-provider";
import { CURRENT_WORKSPACE_COOKIE } from "@/lib/constants/workspace-cookie";
import { createClient } from "@/lib/supabase/server";

function getInitials(name: string): string {
  return (
    name
      .trim()
      .split(/\s+/)
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "?"
  );
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) {
    redirect("/login");
  }

  const [{ data: profile }, { data: memberships }] = await Promise.all([
    supabase.from("profiles").select("full_name").eq("id", authUser.id).single(),
    supabase.from("workspace_members").select("workspace_id, role").eq("user_id", authUser.id),
  ]);

  const workspaceIds = (memberships ?? []).map((membership) => membership.workspace_id);
  const { data: workspaceRows } =
    workspaceIds.length > 0
      ? await supabase.from("workspaces").select("id, name, plan").in("id", workspaceIds)
      : { data: [] };

  const roleByWorkspaceId = new Map(
    (memberships ?? []).map((membership) => [membership.workspace_id, membership.role])
  );

  const workspaces: WorkspaceSummary[] = (workspaceRows ?? []).map((workspace) => ({
    id: workspace.id,
    name: workspace.name,
    plan: workspace.plan,
    role: roleByWorkspaceId.get(workspace.id) ?? "member",
  }));

  if (workspaces.length === 0) {
    redirect("/onboarding");
  }

  const cookieStore = await cookies();
  const currentWorkspaceId = cookieStore.get(CURRENT_WORKSPACE_COOKIE)?.value ?? workspaces[0].id;

  const fullName = profile?.full_name || authUser.email?.split("@")[0] || "Usuário";

  return (
    <WorkspaceProvider
      user={{
        id: authUser.id,
        name: fullName,
        email: authUser.email ?? "",
        initials: getInitials(fullName),
      }}
      workspaces={workspaces}
      currentWorkspaceId={currentWorkspaceId}
    >
      <div className="flex h-dvh overflow-hidden bg-background">
        <AppSidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <AppTopbar />
          <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
        </div>
      </div>
    </WorkspaceProvider>
  );
}
