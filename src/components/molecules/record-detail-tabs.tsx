import { type ReactNode, useState } from "react";
import { Pressable, View } from "react-native";
import { Text } from "@/components/atoms/text";
import { cn } from "@/lib/style/cn";

type RecordDetailTabsProps = {
  tabs: { value: string; label: string; content: ReactNode }[];
};

export function RecordDetailTabs({ tabs }: RecordDetailTabsProps) {
  const [active, setActive] = useState(tabs[0]?.value);
  const current = tabs.find((tab) => tab.value === active);

  return (
    <View className="gap-6">
      <View
        accessibilityRole="tablist"
        className="flex-row gap-6 border-input border-b"
      >
        {tabs.map((tab) => {
          const selected = tab.value === active;
          return (
            <Pressable
              key={tab.value}
              accessibilityRole="tab"
              accessibilityState={{ selected }}
              onPress={() => setActive(tab.value)}
              className={cn(
                "-mb-px border-b-2 pb-2.5",
                selected ? "border-primary" : "border-transparent",
              )}
            >
              <Text
                className={cn(
                  "font-bold text-[15px]",
                  selected ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <View className="min-w-0 gap-6.5">{current?.content}</View>
    </View>
  );
}
