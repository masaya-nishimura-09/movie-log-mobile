import { type Href, Link, useLocalSearchParams } from "expo-router";
import { ScrollView, View } from "react-native";
import { Button } from "@/components/atoms/button";
import { Text } from "@/components/atoms/text";
import { EmptyState } from "@/components/molecules/empty-state";
import { ErrorState } from "@/components/molecules/error-state";
import { LoadingState } from "@/components/molecules/loading-state";
import { Pagination } from "@/components/molecules/pagination";
import { PullRefreshControl } from "@/components/molecules/pull-refresh-control";
import { ActiveFilterList } from "@/components/organisms/active-filter-list";
import { RecordFilterPanel } from "@/components/organisms/record-filter-panel";
import { RecordFilterSheet } from "@/components/organisms/record-filter-sheet";
import { RecordGrid } from "@/components/organisms/record-grid";
import { usePullRefresh } from "@/hooks/use-pull-refresh";
import { useRecords } from "@/hooks/use-records";
import { useI18n } from "@/i18n/use-i18n";
import {
  parseRecordQuery,
  recordQueryKeys,
  toQueryValues,
} from "@/lib/record/parse-record-query";
import { interpolate } from "@/lib/text/interpolate";
import { buildHref } from "@/lib/url/build-href";

const basePath = "/records";

function RecordsContent() {
  const { dict, locale } = useI18n();
  const params = useLocalSearchParams();
  const query = parseRecordQuery(params);
  const { data: list, isPending, isError, refetch } = useRecords(query);
  const { refreshing, onRefresh } = usePullRefresh(refetch);

  if (isPending) return <LoadingState />;
  if (isError || !list) {
    return <ErrorState dict={dict.errorPage} onRetry={() => void refetch()} />;
  }

  const values = toQueryValues(query);
  const clearHref = buildHref(basePath, {
    [recordQueryKeys.sort]: values[recordQueryKeys.sort],
  });
  const activeCount =
    (query.score === undefined ? 0 : 1) +
    (query.platform === undefined ? 0 : 1) +
    query.moodTags.length +
    query.genres.length +
    (query.keyword === "" ? 0 : 1);
  const pageHref = (page: number) =>
    buildHref(basePath, {
      ...values,
      [recordQueryKeys.page]: page === 1 ? undefined : String(page),
    });
  const filterProps = { basePath, query, values, enums: dict.enums };

  const header = (
    <View className="gap-3">
      <View className="flex-row items-end justify-between gap-4">
        <View className="flex-1 gap-0.75">
          <Text className="font-bold text-2xl text-foreground">
            {dict.recordList.heading}
          </Text>
          {list.totalCount > 0 && (
            <Text className="text-[13px] text-foreground-sub">
              {interpolate(dict.recordList.summary, {
                total: list.totalCount,
                shown: list.filteredCount,
              })}
              {activeCount > 0 &&
                ` ・ ${interpolate(dict.recordList.activeFilters, {
                  count: activeCount,
                })}`}
            </Text>
          )}
        </View>
        {list.totalCount > 0 && (
          <RecordFilterSheet
            activeCount={activeCount}
            resultCount={list.filteredCount}
            clearHref={clearHref}
            closeLabel={dict.recordForm.back}
            dict={dict.recordFilter}
          >
            <RecordFilterPanel
              {...filterProps}
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

  const refreshControl = (
    <PullRefreshControl refreshing={refreshing} onRefresh={onRefresh} />
  );

  if (list.totalCount === 0) {
    return (
      <ScrollView
        contentContainerClassName="gap-5 px-4 pt-5 pb-7"
        refreshControl={refreshControl}
      >
        {header}
        <EmptyState
          title={dict.emptyState.title}
          description={dict.emptyState.description}
          action={
            <Link href="/new" asChild>
              <Button>{dict.emptyState.action}</Button>
            </Link>
          }
        />
      </ScrollView>
    );
  }

  if (list.records.length === 0) {
    return (
      <ScrollView
        contentContainerClassName="gap-5 px-4 pt-5 pb-7"
        refreshControl={refreshControl}
      >
        {header}
        <EmptyState
          title={dict.recordList.noMatch}
          action={
            <Link href={clearHref as Href} replace asChild>
              <Button variant="outline">{dict.recordList.clearFilters}</Button>
            </Link>
          }
        />
      </ScrollView>
    );
  }

  return (
    <RecordGrid
      locale={locale}
      records={list.records}
      dict={dict}
      header={header}
      refreshing={refreshing}
      onRefresh={onRefresh}
      footer={
        list.pageCount > 1 ? (
          <View className="pt-3.5">
            <Pagination
              previousHref={list.page > 1 ? pageHref(list.page - 1) : undefined}
              nextHref={
                list.page < list.pageCount ? pageHref(list.page + 1) : undefined
              }
              status={interpolate(dict.recordList.pageStatus, {
                current: list.page,
                total: list.pageCount,
              })}
              previousLabel={dict.recordList.previousPage}
              nextLabel={dict.recordList.nextPage}
            />
          </View>
        ) : null
      }
    />
  );
}

export default function RecordsPage() {
  return (
    <View className="flex-1 bg-background">
      <RecordsContent />
    </View>
  );
}
