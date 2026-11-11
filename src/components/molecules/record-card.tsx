import { type Href, Link } from "expo-router";
import { Pressable, View } from "react-native";
import { MaskingTape } from "@/components/atoms/masking-tape";
import { ScoreBadge } from "@/components/atoms/score-badge";
import { Text } from "@/components/atoms/text";
import { RecordPoster } from "@/components/molecules/record-poster";
import { cn } from "@/lib/style/cn";
import type { Score } from "@/schemas/record/enums";

type RecordCardProps = {
  href: string;
  title: string;
  posterUrl: string;
  score: Score;
  scoreLabel: string;
  meta: string;
  watchedStamp: string;
  noPosterLabel: string;
  index: number;
};

export function RecordCard({
  href,
  title,
  posterUrl,
  score,
  scoreLabel,
  meta,
  watchedStamp,
  noPosterLabel,
  index,
}: RecordCardProps) {
  return (
    <Link href={href as Href} asChild>
      <Pressable
        accessibilityRole="link"
        className="w-full flex-1 gap-2.5 pt-2"
      >
        <View>
          <View
            className="rounded-[3px]"
            style={{ boxShadow: "0 6px 14px -8px rgba(10, 41, 71, 0.55)" }}
          >
            <RecordPoster
              posterUrl={posterUrl}
              noPosterLabel={noPosterLabel}
              className="rounded-[3px]"
              badge={<ScoreBadge score={score} size="sm" label={scoreLabel} />}
            />
          </View>
          <MaskingTape
            tapeClassName={cn(
              index % 3 === 2 && "-rotate-1",
              index % 3 === 1 && "rotate-2",
            )}
          />
        </View>
        <View className="gap-1 px-0.5">
          <Text
            numberOfLines={2}
            className="h-[39.2px] font-bold text-foreground text-sm leading-[1.4]"
          >
            {title}
          </Text>
          <View className="flex-row items-center justify-between gap-2">
            <Text
              numberOfLines={1}
              className="min-w-0 flex-1 text-[11px] text-muted-foreground"
            >
              {meta}
            </Text>
            <Text className="shrink-0 text-[11px] text-muted-foreground">
              {watchedStamp}
            </Text>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}
