import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "@/api/user/get-current-user";

export function useCurrentUser(enabled = true) {
  return useQuery({ queryKey: ["user"], queryFn: getCurrentUser, enabled });
}
