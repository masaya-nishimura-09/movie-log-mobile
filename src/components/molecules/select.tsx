import { Check, ChevronDown } from "lucide-react-native";
import { useState } from "react";
import { Pressable, View } from "react-native";
import { Icon } from "@/components/atoms/icon";
import { Text } from "@/components/atoms/text";
import { Sheet } from "@/components/molecules/sheet";
import { cn } from "@/lib/style/cn";

type SelectOptionItem = { value: string; label: string };

type SelectProps = {
  items: SelectOptionItem[];
  value: string;
  onValueChange: (value: string) => void;
  label: string;
  closeLabel: string;
  size?: "sm" | "default";
  className?: string;
};

export function Select({
  items,
  value,
  onValueChange,
  label,
  closeLabel,
  size = "default",
  className,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const selected = items.find((item) => item.value === value);

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        onPress={() => setOpen(true)}
        className={cn(
          "flex-row items-center justify-between gap-1.5 bg-field pr-2.5 pl-3.5",
          size === "sm" ? "h-9.5 rounded-[10px]" : "h-11 rounded-lg",
          className,
        )}
      >
        <Text
          numberOfLines={1}
          className="flex-1 font-medium text-foreground text-sm"
        >
          {selected?.label ?? ""}
        </Text>
        <Icon icon={ChevronDown} size={16} className="text-muted-foreground" />
      </Pressable>
      <Sheet
        visible={open}
        onClose={() => setOpen(false)}
        title={label}
        closeLabel={closeLabel}
      >
        <View className="gap-1">
          {items.map((item) => (
            <Pressable
              key={item.value}
              accessibilityRole="button"
              onPress={() => {
                onValueChange(item.value);
                setOpen(false);
              }}
              className="h-11 flex-row items-center justify-between rounded-lg px-3 active:bg-secondary"
            >
              <Text className="font-medium text-foreground text-sm">
                {item.label}
              </Text>
              {item.value === value && (
                <Icon icon={Check} size={16} className="text-primary" />
              )}
            </Pressable>
          ))}
        </View>
      </Sheet>
    </>
  );
}
