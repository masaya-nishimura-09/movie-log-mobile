import { Pressable, View } from "react-native";
import { Text } from "@/components/atoms/text";
import { useReplaceQuery } from "@/hooks/use-replace-query";
import { cn } from "@/lib/style/cn";

type FilterRadioLinkProps = {
  href: string;
  active: boolean;
  label: string;
};

export function FilterRadioLink({ href, active, label }: FilterRadioLinkProps) {
  const replaceQuery = useReplaceQuery();

  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ checked: active }}
      onPress={() => replaceQuery(href)}
      className="flex-row items-center gap-2.25"
    >
      <View
        className={cn(
          "size-4.25 shrink-0 items-center justify-center rounded-full",
          active ? "bg-selected-border" : "bg-field",
        )}
      >
        {active && (
          <View className="size-1.75 rounded-full bg-primary-foreground" />
        )}
      </View>
      <Text
        numberOfLines={1}
        className="flex-1 font-medium text-[13px] text-foreground"
      >
        {label}
      </Text>
    </Pressable>
  );
}
