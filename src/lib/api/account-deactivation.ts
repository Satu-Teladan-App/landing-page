import { getSupabaseBrowserClient } from "@/lib/supabase/client";

/**
 * Get the current user's deactivation status
 */
export async function getDeactivationStatus(): Promise<boolean> {
  const supabase = getSupabaseBrowserClient();

  // Get the current session
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError || !session) {
    throw new Error("User must be authenticated");
  }

  const response = await fetch("/api/account-deactivate", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch deactivation status");
  }

  const data = await response.json();
  return data.deactivated || false;
}

/**
 * Deactivate or reactivate the user account
 */
export async function updateDeactivationStatus(deactivate: boolean) {
  const supabase = getSupabaseBrowserClient();

  // Get the current session
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError || !session) {
    throw new Error("User must be authenticated");
  }

  const response = await fetch("/api/account-deactivate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({ deactivate }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to update account status");
  }

  return response.json();
}
