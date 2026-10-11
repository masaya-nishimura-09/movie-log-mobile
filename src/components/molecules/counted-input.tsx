import type { ComponentProps } from "react";
import { View } from "react-native";
import { Input } from "@/components/atoms/input";
import { Text } from "@/components/atoms/text";
import { interpolate } from "@/lib/text/interpolate";

type CountedInputProps = Omit<
  ComponentProps<typeof Input>,
  "maxLength" | "value"
> & {
  value: string;
  maxLength: number;
  counterTemplate: string;
};

export function CountedInput({
  value,
  maxLength,
  counterTemplate,
  ...props
}: CountedInputProps) {
  return (
    <View className="relative">
      <Input value={value} maxLength={maxLength} className="pr-20" {...props} />
      <View
        pointerEvents="none"
        className="absolute inset-y-0 right-3 justify-center"
      >
        <Text className="text-muted-foreground text-xs">
          {interpolate(counterTemplate, {
            current: value.length,
            max: maxLength,
          })}
        </Text>
      </View>
    </View>
  );
}
