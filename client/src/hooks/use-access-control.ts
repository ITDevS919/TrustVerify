import { useAuth } from "./use-auth";
import { useQuery } from "@tanstack/react-query";

// List of usernames allowed to access sensitive sections (CRM, HR, etc.)
// NOTE: This is a client-side check for UI decisions only!
// The real security is enforced on the server via middleware
const AUTHORIZED_USERS = ["michael80"];

interface ServerAccessCheck {
  hasAccess: boolean;
  currentUser: string | null;
}

export function useAccessControl() {
  const { user } = useAuth();
  
  // Verify access with the server (server-side validation is the source of truth)
  const { data: serverAccessCheck } = useQuery<ServerAccessCheck>({
    queryKey: ["/api/user/sensitive-access"],
    enabled: !!user,
  });
  
  // Client-side check (for immediate UI feedback before server response)
  const clientSideAccess = user && user.username ? AUTHORIZED_USERS.includes(user.username) : false;
  
  // Use server-side validation as source of truth when available
  const hasAccessToSensitiveSections = serverAccessCheck?.hasAccess ?? clientSideAccess;
  
  return {
    hasAccessToSensitiveSections,
    isAuthorizedUser: hasAccessToSensitiveSections,
    currentUser: user?.username || null
  };
}
