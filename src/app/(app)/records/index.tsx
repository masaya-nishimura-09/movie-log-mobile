import { type Href, Link, useLocalSearchParams } from "expo-router";
import { ScrollView, View } from "react-native";
import { Button } from "@/components/atoms/button";
import { EmptyState } from "@/components/molecules/empty-state";
import { ErrorState } from "@/components/molecules/error-state";
import { LoadingState } from "@/components/molecules/loading-state";
import { Pagination } from "@/components/molecules/pagination";
import { PullRefreshControl } from "@/components/molecules/pull-refresh-control";
import { RecordGrid } from "@/components/organisms/record-grid";
import { RecordListHeader } from "@/components/organisms/record-list-header";
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
  const pageHref = (page: number) =>
    buildHref(basePath, {
      ...values,
      [recordQueryKeys.page]: page === 1 ? undefined : String(page),
    });
  const header = (
    <RecordListHeader
      basePath={basePath}
      query={query}
      values={values}
      clearHref={clearHref}
      totalCount={list.totalCount}
      filteredCount={list.filteredCount}
      dict={dict}
    />
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
