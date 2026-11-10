import { View } from "react-native";
import Svg, { Polygon } from "react-native-svg";
import { cn } from "@/lib/style/cn";

const tapePoints =
  "0,8 4,0 8,10 12,0 88,0 92,10 96,0 100,8 100,92 96,100 92,90 88,100 12,100 8,90 4,100 0,92";

type MaskingTapeProps = {
  className?: string;
  tapeClassName?: string;
};

export function MaskingTape({ className, tapeClassName }: MaskingTapeProps) {
  return (
    <View
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      className={cn("absolute inset-x-0 -top-2 items-center", className)}
    >
      <View className={cn("h-4.5 w-16 -rotate-3", tapeClassName)}>
        <Svg
          width="100%"
          height="100%"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <Polygon points={tapePoints} fill="rgba(211, 212, 192, 0.72)" />
        </Svg>
      </View>
    </View>
  );
}
