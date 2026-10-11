import { Clapperboard } from "lucide-react-native";
import type { ReactNode } from "react";
import { View } from "react-native";
import { Icon } from "@/components/atoms/icon";
import { Text } from "@/components/atoms/text";

type EmptyStateProps = {
  title: string;
  description?: string;
  action?: ReactNode;
};

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <View className="w-full max-w-110 items-center gap-3 self-center rounded-[18px] bg-card px-6 pt-7.5 pb-7">
      <View className="mb-1 size-22 items-center justify-center rounded-[22px] bg-secondary">
        <Icon icon={Clapperboard} size={28} className="text-muted-foreground" />
      </View>
      <Text className="text-center font-bold text-foreground text-lg">
        {title}
      </Text>
      {description && (
        <Text className="text-center text-[13px] text-foreground-sub leading-relaxed">
          {description}
        </Text>
      )}
      {action && <View className="mt-2">{action}</View>}
    </View>
  );
}
