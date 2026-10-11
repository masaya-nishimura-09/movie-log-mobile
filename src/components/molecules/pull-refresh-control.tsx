import { RefreshControl } from "react-native";
import { useCssVariable } from "@/hooks/use-css-variable";

type PullRefreshControlProps = {
  refreshing: boolean;
  onRefresh: () => void;
};

export function PullRefreshControl({
  refreshing,
  onRefresh,
}: PullRefreshControlProps) {
  const color = useCssVariable("--muted-foreground");

  return (
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      tintColor={color}
      colors={[color]}
    />
  );
}
