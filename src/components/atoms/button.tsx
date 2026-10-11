import { cva, type VariantProps } from "class-variance-authority";
import type { LucideIcon } from "lucide-react-native";
import { Pressable, type PressableProps } from "react-native";
import { Edged } from "@/components/atoms/edged";
import { Icon } from "@/components/atoms/icon";
import { Text } from "@/components/atoms/text";
import { cn } from "@/lib/style/cn";
import { splitLayout } from "@/lib/style/split-layout";

const buttonVariants = cva("flex-row items-center justify-center gap-1.5", {
  variants: {
    variant: {
      default: "bg-primary",
      outline: "",
      secondary: "bg-secondary",
      ghost: "active:bg-secondary",
      destructive: "",
      danger: "bg-destructive",
      link: "",
    },
    size: {
      default: "h-11 px-4",
      sm: "h-9.5 px-3.5",
      lg: "h-12 px-5",
      icon: "size-11",
    },
    active: {
      true: "bg-selected",
      false: "",
    },
  },
  defaultVariants: { variant: "default", size: "default", active: false },
});

const labelVariants = cva("font-medium", {
  variants: {
    variant: {
      default: "font-bold text-primary-foreground",
      outline: "text-foreground",
      secondary: "text-secondary-foreground",
      ghost: "text-foreground-sub",
      destructive: "text-destructive-foreground",
      danger: "font-bold text-primary-foreground",
      link: "text-primary",
    },
    size: {
      default: "text-sm",
      sm: "text-sm",
      lg: "text-base",
      icon: "text-sm",
    },
    active: {
      true: "text-selected-foreground",
      false: "",
    },
  },
  defaultVariants: { variant: "default", size: "default", active: false },
});

const edges = {
  default: { edge: "--primary-edge", ring: false },
  outline: { edge: "--edge", ring: true },
  destructive: { edge: "--destructive-border", ring: true },
  danger: { edge: "--destructive-edge", ring: false },
} as const;

type Variant = NonNullable<VariantProps<typeof buttonVariants>["variant"]>;
type Size = NonNullable<VariantProps<typeof buttonVariants>["size"]>;

type ButtonProps = Omit<PressableProps, "children"> & {
  variant?: Variant;
  size?: Size;
  active?: boolean;
  className?: string;
  icon?: LucideIcon;
  iconEnd?: LucideIcon;
  iconSize?: number;
  children?: string;
};

export function Button({
  variant = "default",
  size = "default",
  active = false,
  className,
  icon,
  iconEnd,
  iconSize,
  children,
  ...props
}: ButtonProps) {
  const { outer, inner } = splitLayout(className);
  const rounded = size === "sm" ? "rounded-[10px]" : "rounded-lg";
  const label = labelVariants({ variant, size, active });
  const resolvedIconSize = iconSize ?? (size === "sm" ? 14 : 16);
  const content = (
    <>
      {icon && <Icon icon={icon} size={resolvedIconSize} className={label} />}
      {children !== undefined && <Text className={label}>{children}</Text>}
      {iconEnd && (
        <Icon icon={iconEnd} size={resolvedIconSize} className={label} />
      )}
    </>
  );
  const box = cn(buttonVariants({ variant, size, active }), rounded, inner);

  if (variant in edges) {
    return (
      <Edged
        accessibilityRole="button"
        {...edges[variant as keyof typeof edges]}
        rounded={rounded}
        className={outer}
        contentClassName={box}
        {...props}
      >
        {content}
      </Edged>
    );
  }
  return (
    <Pressable
      accessibilityRole="button"
      className={cn(box, outer, props.disabled && "opacity-50")}
      {...props}
    >
      {content}
    </Pressable>
  );
}
