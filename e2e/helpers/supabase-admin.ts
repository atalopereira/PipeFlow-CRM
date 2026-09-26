// Test-only helpers that use the Supabase service role key to bypass email
// confirmation and pre-provision data, since Playwright can't read a real inbox.
// Requires SUPABASE_SERVICE_ROLE_KEY / NEXT_PUBLIC_SUPABASE_URL in the test
// runner's env (see the `--env-file=.env.local` flag on the test:e2e script).

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

function adminHeaders(): Record<string, string> {
  return {
    apikey: SERVICE_ROLE_KEY,
    Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
    "Content-Type": "application/json",
  };
}

async function findUserIdByEmail(email: string): Promise<string> {
  const response = await fetch(`${SUPABASE_URL}/auth/v1/admin/users?per_page=1000`, {
    headers: adminHeaders(),
  });
  const { users } = (await response.json()) as { users: { id: string; email: string }[] };
  const user = users.find((candidate) => candidate.email === email);
  if (!user) {
    throw new Error(`Test user ${email} not found via admin API`);
  }
  return user.id;
}

// Simulates the user clicking the confirmation link in their email.
export async function confirmTestUser(email: string): Promise<string> {
  const userId = await findUserIdByEmail(email);
  await fetch(`${SUPABASE_URL}/auth/v1/admin/users/${userId}`, {
    method: "PUT",
    headers: adminHeaders(),
    body: JSON.stringify({ email_confirm: true }),
  });
  return userId;
}

// Creates an already-confirmed user directly, without sending a real
// confirmation e-mail. Supabase's built-in email service has a strict
// per-hour rate limit, so tests that only need a logged-in user (as opposed
// to testing the confirmation flow itself) should use this instead of
// driving the signup form.
export async function createConfirmedTestUser(
  email: string,
  password: string,
  fullName: string
): Promise<string> {
  const response = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
    method: "POST",
    headers: adminHeaders(),
    body: JSON.stringify({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName },
    }),
  });
  const user = (await response.json()) as { id: string };
  return user.id;
}

export async function createTestWorkspace(userId: string, name: string): Promise<string> {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/workspaces`, {
    method: "POST",
    headers: { ...adminHeaders(), Prefer: "return=representation" },
    body: JSON.stringify({ name, created_by: userId }),
  });
  const [workspace] = (await response.json()) as { id: string }[];

  await fetch(`${SUPABASE_URL}/rest/v1/workspace_members`, {
    method: "POST",
    headers: { ...adminHeaders(), Prefer: "return=minimal" },
    body: JSON.stringify({ workspace_id: workspace.id, user_id: userId, role: "admin" }),
  });

  return workspace.id;
}

// Deletes a workspace's membership + row (avoids leaving the auth user's FK
// dangling), then the auth user itself (cascades to its profile row).
export async function deleteTestUser(email: string): Promise<void> {
  const userId = await findUserIdByEmail(email).catch(() => null);
  if (!userId) return;

  const membershipsRes = await fetch(
    `${SUPABASE_URL}/rest/v1/workspace_members?user_id=eq.${userId}&select=workspace_id`,
    { headers: adminHeaders() }
  );
  const memberships = (await membershipsRes.json()) as { workspace_id: string }[];

  for (const { workspace_id: workspaceId } of memberships) {
    await fetch(`${SUPABASE_URL}/rest/v1/workspace_members?workspace_id=eq.${workspaceId}`, {
      method: "DELETE",
      headers: adminHeaders(),
    });
    await fetch(`${SUPABASE_URL}/rest/v1/workspaces?id=eq.${workspaceId}`, {
      method: "DELETE",
      headers: adminHeaders(),
    });
  }

  await fetch(`${SUPABASE_URL}/auth/v1/admin/users/${userId}`, {
    method: "DELETE",
    headers: adminHeaders(),
  });
}

export function uniqueTestEmail(): string {
  return `e2e+${Date.now()}-${Math.random().toString(36).slice(2)}@pipeflow.com`;
}
