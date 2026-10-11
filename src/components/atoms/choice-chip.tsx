import { cva, type VariantProps } from "class-variance-authority";
import type { PressableProps } from "react-native";
import { Edged } from "@/components/atoms/edged";
import { Text } from "@/components/atoms/text";
import { cn } from "@/lib/style/cn";
import { splitLayout } from "@/lib/style/split-layout";

const choiceChipVariants = cva("flex-row items-center justify-center gap-1.5", {
  variants: {
    size: {
      sm: "h-8 px-2.5",
      md: "h-9.5 px-3.5",
      lg: "h-11 px-3",
    },
    tone: {
      plain: "",
      field: "",
      mood: "bg-mood-tag",
      genre: "bg-genre-chip",
    },
    active: {
      true: "",
      false: "",
    },
  },
  compoundVariants: [
    { active: true, tone: "plain", className: "bg-selected" },
    { active: true, tone: "field", className: "bg-selected" },
    { active: true, tone: "mood", className: "bg-selected" },
    { active: true, tone: "genre", className: "bg-genre-selected" },
  ],
  defaultVariants: { size: "md", tone: "plain", active: false },
});

const labelVariants = cva("font-medium", {
  variants: {
    size: {
      sm: "text-xs",
      md: "text-[13px]",
      lg: "text-base",
    },
    tone: {
      plain: "text-foreground",
      field: "text-foreground-sub",
      mood: "text-foreground",
      genre: "text-genre-foreground",
    },
    shape: {
      pill: "",
      square: "",
      block: "font-bold",
    },
    active: {
      true: "",
      false: "",
    },
  },
  compoundVariants: [
    { active: true, tone: "plain", className: "text-selected-foreground" },
    { active: true, tone: "field", className: "text-selected-foreground" },
    { active: true, tone: "mood", className: "text-selected-foreground" },
    {
      active: true,
      tone: "genre",
      className: "text-genre-selected-foreground",
    },
  ],
  defaultVariants: { size: "md", tone: "plain", shape: "pill", active: false },
});

const edges = {
  plain: "--edge",
  field: "--edge",
  mood: "--edge",
  genre: "--control-edge",
} as const;

const shapes = {
  pill: "rounded-full",
  square: "rounded-md",
  block: "rounded-lg",
};

export type ChoiceChipStyle = {
  shape?: keyof typeof shapes;
  size?: NonNullable<VariantProps<typeof choiceChipVariants>["size"]>;
  tone?: keyof typeof edges;
};

type ChoiceChipProps = Omit<PressableProps, "children"> &
  ChoiceChipStyle & {
    active?: boolean;
    className?: string;
    labelClassName?: string;
    children: string;
  };

export function ChoiceChip({
  shape = "pill",
  size,
  tone = "plain",
  active = false,
  className,
  labelClassName,
  children,
  ...props
}: ChoiceChipProps) {
  const { outer, inner } = splitLayout(className);
  const rounded = cn(
    shapes[shape],
    inner
      .split(" ")
      .filter((token) => token.startsWith("rounded"))
      .join(" "),
  );

  return (
    <Edged
      accessibilityRole="button"
      accessibilityState={{
        selected: active,
        disabled: props.disabled ?? false,
      }}
      edge={edges[tone]}
      ring
      rounded={rounded}
      depth={active ? "pressed" : "shallow"}
      className={cn(shape === "block" && "flex-1", outer)}
      contentClassName={cn(choiceChipVariants({ size, tone, active }), inner)}
      {...props}
    >
      <Text
        className={cn(
          labelVariants({ size, tone, shape, active }),
          labelClassName,
        )}
      >
        {children}
      </Text>
    </Edged>
  );
}
