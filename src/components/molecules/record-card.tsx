import { type Href, Link } from "expo-router";
import { Pressable, View } from "react-native";
import { ScoreBadge } from "@/components/atoms/score-badge";
import { Text } from "@/components/atoms/text";
import { RecordPoster } from "@/components/molecules/record-poster";
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
}: RecordCardProps) {
  return (
    <Link href={href as Href} asChild>
      <Pressable
        accessibilityRole="link"
        className="w-full flex-1 rounded-[14px] bg-card active:scale-[0.99]"
      >
        <RecordPoster
          posterUrl={posterUrl}
          noPosterLabel={noPosterLabel}
          className="rounded-t-[14px]"
          badge={<ScoreBadge score={score} size="sm" label={scoreLabel} />}
        />
        <View className="relative h-0">
          <View className="absolute inset-x-3 top-0 h-px overflow-hidden">
            <View className="h-2 border border-input border-dashed" />
          </View>
          <View className="absolute -top-2.5 left-0 h-5 w-2.5 overflow-hidden">
            <View className="-ml-2.5 size-5 rounded-full bg-background" />
          </View>
          <View className="absolute -top-2.5 right-0 h-5 w-2.5 overflow-hidden">
            <View className="size-5 rounded-full bg-background" />
          </View>
        </View>
        <View className="h-22 gap-1.25 px-3 py-2.75">
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
            <View className="-rotate-6 rounded-sm border-2 border-primary px-1.5 py-px opacity-70">
              <Text className="font-bold text-[10px] text-primary tracking-wider">
                {watchedStamp}
              </Text>
            </View>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}
