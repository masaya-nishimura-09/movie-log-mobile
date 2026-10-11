import type { ReactNode } from "react";
import { Text } from "@/components/atoms/text";

export function FormAlert({ children }: { children: ReactNode }) {
  return (
    <Text
      accessibilityRole="alert"
      className="rounded-lg bg-destructive-soft px-3.5 py-2.5 text-destructive-foreground text-sm"
    >
      {children}
    </Text>
  );
}
