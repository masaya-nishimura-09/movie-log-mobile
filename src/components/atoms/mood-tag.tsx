import { View } from "react-native";
import { Text } from "@/components/atoms/text";

export function MoodTag({ children }: { children: string }) {
  return (
    <View className="rounded-full bg-mood-tag px-3 py-1">
      <Text className="text-foreground-sub text-xs leading-4">{children}</Text>
    </View>
  );
}
