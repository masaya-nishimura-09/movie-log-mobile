import { Text as TextBase, type TextProps } from "react-native";
import { cn } from "@/lib/style/cn";

type AppTextProps = TextProps & { className?: string };

export function Text({ className, ...props }: AppTextProps) {
  return <TextBase className={cn("font-sans", className)} {...props} />;
}
