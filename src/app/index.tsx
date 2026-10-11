import { Redirect } from "expo-router";
import { useSession } from "@/hooks/use-session";

export default function Index() {
  const session = useSession();

  if (session === "loading") return null;
  return (
    <Redirect href={session === "authenticated" ? "/records" : "/login"} />
  );
}
