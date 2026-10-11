import type { ReactNode } from "react";
import { Text } from "@/components/atoms/text";

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <Text className="font-bold text-muted-foreground text-xs tracking-[0.08em]">
      {children}
    </Text>
  );
}
