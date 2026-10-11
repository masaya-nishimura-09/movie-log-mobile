import { useEffect, useState } from "react";
import { loadTokens } from "@/lib/auth/token-storage";

export type SessionStatus = "loading" | "authenticated" | "unauthenticated";

export function useSession(): SessionStatus {
  const [status, setStatus] = useState<SessionStatus>("loading");

  useEffect(() => {
    loadTokens().then((tokens) =>
      setStatus(tokens ? "authenticated" : "unauthenticated"),
    );
  }, []);

  return status;
}
