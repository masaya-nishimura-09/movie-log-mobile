import { View, type ViewProps } from "react-native";
import { cn } from "@/lib/style/cn";

type SkeletonProps = ViewProps & { className?: string };

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <View
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  );
}
