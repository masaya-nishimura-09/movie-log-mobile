import { View } from "react-native";
import { Skeleton } from "@/components/atoms/skeleton";

export function LoadingState() {
  return (
    <View className="gap-4 px-4 pt-5">
      <Skeleton className="h-8 w-1/2" />
      <Skeleton className="h-40 w-full" />
      <Skeleton className="h-40 w-full" />
    </View>
  );
}
