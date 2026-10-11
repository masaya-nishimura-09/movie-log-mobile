import { View } from "react-native";
import { Text } from "@/components/atoms/text";

export function GenreTag({ children }: { children: string }) {
  return (
    <View className="rounded-md bg-control px-2.75 py-1">
      <Text className="text-foreground-sub text-xs leading-4">{children}</Text>
    </View>
  );
}
