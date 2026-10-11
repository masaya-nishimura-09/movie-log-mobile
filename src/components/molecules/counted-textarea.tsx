import type { ComponentProps } from "react";
import { View } from "react-native";
import { Text } from "@/components/atoms/text";
import { Textarea } from "@/components/atoms/textarea";
import { interpolate } from "@/lib/text/interpolate";

type CountedTextareaProps = Omit<
  ComponentProps<typeof Textarea>,
  "maxLength" | "value"
> & {
  value: string;
  maxLength: number;
  counterTemplate: string;
};

export function CountedTextarea({
  value,
  maxLength,
  counterTemplate,
  ...props
}: CountedTextareaProps) {
  return (
    <View className="gap-1">
      <Textarea
        value={value}
        maxLength={maxLength}
        className="min-h-32 leading-loose"
        {...props}
      />
      <Text className="self-end text-muted-foreground text-xs">
        {interpolate(counterTemplate, {
          current: value.length,
          max: maxLength,
        })}
      </Text>
    </View>
  );
}
