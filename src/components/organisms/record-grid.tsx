import type { ReactElement } from "react";
import { FlatList, View } from "react-native";
import { PullRefreshControl } from "@/components/molecules/pull-refresh-control";
import { RecordCard } from "@/components/molecules/record-card";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/locales";
import { formatDate } from "@/lib/date/format-date";
import { interpolate } from "@/lib/text/interpolate";
import type { MovieRecord } from "@/schemas/record/record";

type RecordGridProps = {
  locale: Locale;
  records: MovieRecord[];
  dict: Dictionary;
  header: ReactElement;
  footer: ReactElement | null;
  refreshing: boolean;
  onRefresh: () => void;
};

export function RecordGrid({
  locale,
  records,
  dict,
  header,
  footer,
  refreshing,
  onRefresh,
}: RecordGridProps) {
  const items: (MovieRecord | null)[] =
    records.length % 2 === 0 ? records : [...records, null];

  return (
    <FlatList
      data={items}
      numColumns={2}
      keyExtractor={(item, index) => item?.recordId ?? `spacer-${index}`}
      columnWrapperClassName="gap-3.5"
      contentContainerClassName="gap-3.5 px-4 pt-5 pb-7"
      ListHeaderComponent={header}
      ListFooterComponent={footer}
      refreshControl={
        <PullRefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      renderItem={({ item }) => {
        if (!item) return <View className="flex-1" />;
        const year = item.releaseYear > 0 ? String(item.releaseYear) : "";
        const platformLabel = dict.enums.platform[item.platform];
        const watchedShort = formatDate(item.watchedAt, locale, "short");
        return (
          <View className="flex-1">
            <RecordCard
              href={`/records/${item.recordId}`}
              title={item.title}
              posterUrl={item.posterUrl}
              score={item.score}
              scoreLabel={interpolate(dict.recordCard.score, {
                score: item.score,
              })}
              year={year}
              platformLabel={platformLabel}
              meta={[year, platformLabel].filter(Boolean).join(" · ")}
              watchedStamp={watchedShort}
              watchedLabel={interpolate(dict.recordCard.watched, {
                date: watchedShort,
              })}
              noPosterLabel={dict.recordCard.noPoster}
            />
          </View>
        );
      }}
    />
  );
}
