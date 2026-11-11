import type { ReactNode } from "react";
import { View } from "react-native";
import { BrandShape } from "@/components/atoms/brand-shape";
import { Image } from "@/components/atoms/image";
import { markShapes } from "@/components/atoms/logo-shapes";
import { useCssVariable } from "@/hooks/use-css-variable";
import { cn } from "@/lib/style/cn";

type RecordPosterProps = {
  posterUrl: string;
  noPosterLabel: string;
  badge?: ReactNode;
  className?: string;
};

function PosterPlaceholder({ label }: { label: string }) {
  const foreground = useCssVariable("--foreground");
  const primary = useCssVariable("--primary");

  return (
    <View className="flex-1 items-center justify-center bg-header">
      <BrandShape
        shapes={markShapes}
        label={label}
        ringColor={primary}
        ringOpacity={0.6}
        glyphColor={foreground}
        glyphOpacity={0.2}
        style={{ width: "60%", aspectRatio: 1 }}
      />
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
        <PosterPlaceholder label={noPosterLabel} />
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
