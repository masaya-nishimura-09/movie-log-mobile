import { cva, type VariantProps } from "class-variance-authority";
import { Link } from "expo-router";
import type { ComponentProps } from "react";
import { Text } from "@/components/atoms/text";
import { cn } from "@/lib/style/cn";

const textLinkStyles = cva("font-medium", {
  variants: {
    tone: {
      primary: "text-primary",
      muted: "text-foreground-sub",
    },
  },
  defaultVariants: { tone: "primary" },
});

type TextLinkProps = Omit<ComponentProps<typeof Link>, "className"> &
  VariantProps<typeof textLinkStyles> & { className?: string };

export function TextLink({
  tone,
  className,
  children,
  ...props
}: TextLinkProps) {
  return (
    <Link {...props}>
      <Text className={cn(textLinkStyles({ tone }), className)}>
        {children}
      </Text>
    </Link>
  );
}
