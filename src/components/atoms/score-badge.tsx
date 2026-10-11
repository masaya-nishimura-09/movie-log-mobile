import { cva } from "class-variance-authority";
import { View } from "react-native";
import { Text } from "@/components/atoms/text";
import { cn } from "@/lib/style/cn";
import type { Score } from "@/schemas/record/enums";

const boxVariants = cva("items-center justify-center", {
  variants: {
    size: {
      sm: "h-6.5 min-w-6.5 rounded-[8px] px-1.75",
      md: "size-16 gap-1 rounded-[18px]",
      lg: "size-18 gap-1 rounded-[20px]",
    },
    tone: {
      top: "bg-primary",
      high: "bg-score-high",
      plain: "bg-score-low",
    },
  },
});

const scoreVariants = cva("font-bold", {
  variants: {
    size: {
      sm: "text-[13px] leading-4",
      md: "text-2xl",
      lg: "text-3xl",
    },
    tone: {
      top: "text-primary-foreground",
      high: "text-score-high-foreground",
      plain: "text-score-low-foreground",
    },
  },
});

const captionVariants = cva("text-[10px] leading-[14px] opacity-85", {
  variants: {
    tone: {
      top: "text-primary-foreground",
      high: "text-score-high-foreground",
      plain: "text-score-low-foreground",
    },
  },
});

function toneOf(score: Score) {
  if (score === 5) return "top";
  if (score === 4) return "high";
  return "plain";
}

type ScoreBadgeProps = {
  score: Score;
  size: "sm" | "md" | "lg";
  label: string;
  caption?: string;
  className?: string;
};

export function ScoreBadge({
  score,
  size,
  label,
  caption,
  className,
}: ScoreBadgeProps) {
  const tone = toneOf(score);

  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel={label}
      className={cn(boxVariants({ size, tone }), className)}
    >
      <Text className={scoreVariants({ size, tone })}>{score}</Text>
      {caption && <Text className={captionVariants({ tone })}>{caption}</Text>}
    </View>
  );
}
