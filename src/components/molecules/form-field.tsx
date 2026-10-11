import type { ReactNode } from "react";
import { View } from "react-native";
import { Label } from "@/components/atoms/label";
import { Text } from "@/components/atoms/text";
import { cn } from "@/lib/style/cn";

type FormFieldProps = {
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  className?: string;
  children: ReactNode;
};

export function FormField({
  label,
  required,
  hint,
  error,
  className,
  children,
}: FormFieldProps) {
  return (
    <View className={cn("gap-1.5", className)}>
      <Label className="text-[13px]">
        {label}
        {required && <Text className="text-destructive"> *</Text>}
      </Label>
      {children}
      {error ? (
        <Text
          accessibilityRole="alert"
          className="text-destructive-foreground text-xs"
        >
          {error}
        </Text>
      ) : (
        hint && <Text className="text-muted-foreground text-xs">{hint}</Text>
      )}
    </View>
  );
}
