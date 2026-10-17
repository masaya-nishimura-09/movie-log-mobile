import type { ReactNode } from "react";
import { View } from "react-native";
import Svg from "react-native-svg";
import { Image } from "@/components/atoms/image";
import { StampShapes } from "@/components/atoms/stamp-shapes";
import { useCssVariable } from "@/hooks/use-css-variable";
import { cn } from "@/lib/style/cn";

type RecordPosterProps = {
  posterUrl: string;
  noPosterLabel: string;
  badge?: ReactNode;
  className?: string;
};

function StampPlaceholder({ label }: { label: string }) {
  const foreground = useCssVariable("--foreground");
  const header = useCssVariable("--header");
  const primary = useCssVariable("--primary");

  return (
    <View className="flex-1 items-center justify-center bg-header">
      <Svg
        viewBox="0 0 110 110"
        accessibilityLabel={label}
        accessibilityRole="image"
        style={{ width: "50%", aspectRatio: 1 }}
      >
        <StampShapes
          stampColor={foreground}
          stampOpacity={0.2}
          cColor={header}
          playColor={primary}
          playOpacity={0.6}
        />
      </Svg>
    </View>
  );
}

export function RecordPoster({
  posterUrl,
  noPosterLabel,
  badge,
  className,
}: RecordPosterProps) {
  return (
    <View
      className={cn("relative aspect-[2/3] w-full overflow-hidden", className)}
    >
      {posterUrl === "" ? (
        <StampPlaceholder label={noPosterLabel} />
      ) : (
        <Image
          source={{ uri: posterUrl }}
          contentFit="cover"
          accessibilityIgnoresInvertColors
          className="size-full"
        />
      )}
      {badge && <View className="absolute top-2.75 right-2.75">{badge}</View>}
    </View>
  );
}
