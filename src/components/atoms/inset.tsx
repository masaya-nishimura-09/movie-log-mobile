import type { ReactNode } from "react";
import { View } from "react-native";

export function Inset({ children }: { children: ReactNode }) {
  return (
    <View className="shell-inset mx-2 flex-1 overflow-hidden rounded-2xl bg-background">
      {children}
    </View>
  );
}
