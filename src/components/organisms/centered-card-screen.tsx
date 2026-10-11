import type { ReactNode } from "react";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { cn } from "@/lib/style/cn";

const edgeGap = 40;

type CenteredCardScreenProps = {
  cardClassName: string;
  children: ReactNode;
};

export function CenteredCardScreen({
  cardClassName,
  children,
}: CenteredCardScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      className="bg-sidebar"
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{
        flexGrow: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 16,
        paddingTop: insets.top + edgeGap,
        paddingBottom: insets.bottom + edgeGap,
      }}
    >
      <View
        className={cn(
          "shell-inset w-full rounded-[20px] bg-card px-6 py-8",
          cardClassName,
        )}
      >
        {children}
      </View>
    </ScrollView>
  );
}
