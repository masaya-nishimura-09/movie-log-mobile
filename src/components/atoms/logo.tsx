import { Clapperboard } from "lucide-react-native";
import { View } from "react-native";
import { Icon } from "@/components/atoms/icon";
import { Text } from "@/components/atoms/text";
import { cn } from "@/lib/style/cn";

type LogoProps = {
  name: string;
  large?: boolean;
  className?: string;
};

export function Logo({ name, large, className }: LogoProps) {
  return (
    <View className={cn("flex-row items-center gap-2", className)}>
      <Icon
        icon={Clapperboard}
        size={large ? 28 : 22}
        className="text-primary"
      />
      <Text
        className={cn(
          "font-bold text-foreground",
          large ? "text-2xl" : "text-[19px]",
        )}
      >
        {name}
      </Text>
    </View>
  );
}
