import { RefreshControl, type RefreshControlProps } from "react-native";
import { useCssVariable } from "@/hooks/use-css-variable";

export function PullRefreshControl(props: RefreshControlProps) {
  const color = useCssVariable("--muted-foreground");

  return <RefreshControl tintColor={color} colors={[color]} {...props} />;
}
