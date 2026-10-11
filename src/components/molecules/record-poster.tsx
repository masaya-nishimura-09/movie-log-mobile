import type { ReactNode } from "react";
import { View } from "react-native";
import { Image } from "@/components/atoms/image";
import { Text } from "@/components/atoms/text";
import { cn } from "@/lib/style/cn";

type RecordPosterProps = {
  title: string;
  posterUrl: string;
  year: string;
  platformLabel: string;
  size: "card" | "detail";
  badge?: ReactNode;
  className?: string;
};

const titleSizes = {
  card: { short: "text-[21px]", long: "text-[17px]" },
  detail: { short: "text-base", long: "text-[13px]" },
};

export function RecordPoster({
  title,
  posterUrl,
  year,
  platformLabel,
  size,
  badge,
  className,
}: RecordPosterProps) {
  const titleSize =
    titleSizes[size][Array.from(title).length > 12 ? "long" : "short"];

  return (
    <View
      className={cn("relative aspect-[2/3] w-full overflow-hidden", className)}
    >
      {posterUrl === "" ? (
        <View className="flex-1 justify-between bg-header p-3.25">
          <Text className="text-[11px] text-accent-foreground tracking-[0.08em]">
            {year}
          </Text>
          <Text
            className={cn("font-bold text-foreground leading-[1.3]", titleSize)}
          >
            {title}
          </Text>
          <Text
            numberOfLines={1}
            className="text-[11px] text-foreground-sub tracking-[0.04em]"
          >
            {platformLabel}
          </Text>
        </View>
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
