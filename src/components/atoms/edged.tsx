import { type ReactNode, useState } from "react";
import { Pressable, type PressableProps, View } from "react-native";
import { useCssVariable } from "@/hooks/use-css-variable";
import { cn } from "@/lib/style/cn";

const edgeHeight = 3;

const sinks = {
  pressable: 2,
  shallow: 1,
  pressed: 2,
};

function edgeShadow(
  color: string,
  ring: boolean,
  offset: number,
  inset: boolean,
) {
  return [
    inset && `inset 0 2px 3px 0 ${color}`,
    ring && `0 0 0 1px ${color}`,
    offset > 0 && `0 ${offset}px 0 0 ${color}`,
  ]
    .filter(Boolean)
    .join(", ");
}

type EdgedProps = Omit<PressableProps, "children"> & {
  edge: `--${string}`;
  ring?: boolean;
  rounded: string;
  depth?: keyof typeof sinks;
  className?: string;
  contentClassName?: string;
  children: ReactNode;
};

export function Edged({
  edge,
  ring = false,
  rounded,
  depth = "pressable",
  className,
  contentClassName,
  children,
  onPressIn,
  onPressOut,
  ...props
}: EdgedProps) {
  const color = useCssVariable(edge);
  const [pressing, setPressing] = useState(false);
  const pressed = depth === "pressed";
  const sink = pressed || pressing ? sinks[depth] : 0;

  return (
    <Pressable
      onPressIn={(event) => {
        setPressing(true);
        onPressIn?.(event);
      }}
      onPressOut={(event) => {
        setPressing(false);
        onPressOut?.(event);
      }}
      className={cn(props.disabled && "opacity-50", className)}
      {...props}
    >
      <View
        className={cn(rounded, contentClassName)}
        style={{
          transform: [{ translateY: sink }],
          boxShadow: edgeShadow(
            color,
            ring,
            pressed ? 0 : edgeHeight - sink,
            pressed,
          ),
        }}
      >
        {children}
      </View>
    </Pressable>
  );
}
