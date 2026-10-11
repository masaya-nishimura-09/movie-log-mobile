import { View } from "react-native";
import { Text } from "@/components/atoms/text";
import { ActiveFilterList } from "@/components/organisms/active-filter-list";
import { RecordFilterPanel } from "@/components/organisms/record-filter-panel";
import { RecordFilterSheet } from "@/components/organisms/record-filter-sheet";
import type { Dictionary } from "@/i18n/get-dictionary";
import { interpolate } from "@/lib/text/interpolate";
import type { QueryValues } from "@/lib/url/build-href";
import type { RecordQuery } from "@/schemas/record/list";

type RecordListHeaderProps = {
  basePath: string;
  query: RecordQuery;
  values: QueryValues;
  clearHref: string;
  totalCount: number;
  filteredCount: number;
  dict: Dictionary;
};

function countActiveFilters(query: RecordQuery) {
  return (
    (query.score === undefined ? 0 : 1) +
    (query.platform === undefined ? 0 : 1) +
    query.moodTags.length +
    query.genres.length +
    (query.keyword === "" ? 0 : 1)
  );
}

export function RecordListHeader({
  basePath,
  query,
  values,
  clearHref,
  totalCount,
  filteredCount,
  dict,
}: RecordListHeaderProps) {
  const activeCount = countActiveFilters(query);

  return (
    <View className="gap-3">
      <View className="flex-row items-end justify-between gap-4">
        <View className="flex-1 gap-0.75">
          <Text className="font-bold text-2xl text-foreground">
            {dict.recordList.heading}
          </Text>
          {totalCount > 0 && (
            <Text className="text-[13px] text-foreground-sub">
              {interpolate(dict.recordList.summary, {
                total: totalCount,
                shown: filteredCount,
              })}
              {activeCount > 0 &&
                ` ・ ${interpolate(dict.recordList.activeFilters, {
                  count: activeCount,
                })}`}
            </Text>
          )}
        </View>
        {totalCount > 0 && (
          <RecordFilterSheet
            activeCount={activeCount}
            resultCount={filteredCount}
            clearHref={clearHref}
            closeLabel={dict.recordForm.back}
            dict={dict.recordFilter}
          >
            <RecordFilterPanel
              basePath={basePath}
              query={query}
              values={values}
              enums={dict.enums}
              dict={dict.recordFilter}
              sortDict={dict.recordSort}
              closeLabel={dict.recordForm.back}
            />
          </RecordFilterSheet>
        )}
      </View>
      <ActiveFilterList
        basePath={basePath}
        query={query}
        values={values}
        clearHref={clearHref}
        dict={dict.recordFilter}
        enums={dict.enums}
      />
    </View>
  );
}
