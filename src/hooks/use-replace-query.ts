import { useLocalSearchParams, useRouter } from "expo-router";

type RouteParams = Record<string, string | string[] | undefined>;

export function useReplaceQuery() {
  const router = useRouter();
  const current = useLocalSearchParams();

  return (href: string) => {
    const query = new URLSearchParams(href.split("?")[1] ?? "");
    const next: RouteParams = {};
    for (const key of Object.keys(current)) next[key] = undefined;
    for (const key of new Set(query.keys())) {
      const values = query.getAll(key);
      next[key] = values.length > 1 ? values : values[0];
    }
    router.setParams(next);
  };
}
