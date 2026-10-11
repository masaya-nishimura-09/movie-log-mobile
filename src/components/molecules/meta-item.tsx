import type { LucideIcon } from "lucide-react-native";
import { View } from "react-native";
import { Icon } from "@/components/atoms/icon";
import { Text } from "@/components/atoms/text";

type MetaItemProps = {
  icon: LucideIcon;
  label: string;
  value: string;
};

export function MetaItem({ icon, label, value }: MetaItemProps) {
  return (
    <View
      accessible
      accessibilityLabel={`${label}: ${value}`}
      className="shrink flex-row items-start gap-1"
    >
      <View className="h-[21px] justify-center">
        <Icon icon={icon} size={13} className="text-muted-foreground" />
      </View>
      <Text className="shrink text-[13px] text-foreground-sub leading-relaxed">
        {value}
      </Text>
    </View>
  );
}
