import type { TextProps } from "react-native";
import { Text } from "@/components/atoms/text";
import { cn } from "@/lib/style/cn";

type LabelProps = TextProps & { className?: string };

export function Label({ className, ...props }: LabelProps) {
  return (
    <Text
      className={cn("font-bold text-foreground text-sm", className)}
      {...props}
    />
  );
}
