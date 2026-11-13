import { useQueryClient } from "@tanstack/react-query";
import { type Href, Link, useLocalSearchParams, useRouter } from "expo-router";
import { Pencil } from "lucide-react-native";
import { View } from "react-native";
import {
  addAttachmentAction,
  deleteAttachmentAction,
} from "@/actions/record/attachment";
import { deleteRecordAction } from "@/actions/record/delete-record";
import { Button } from "@/components/atoms/button";
import { EmptyState } from "@/components/molecules/empty-state";
import { ErrorState } from "@/components/molecules/error-state";
import { LoadingState } from "@/components/molecules/loading-state";
import { DeleteRecordDialog } from "@/components/organisms/delete-record-dialog";
import { PageTopBar } from "@/components/organisms/page-top-bar";
import { RecordDetail } from "@/components/organisms/record-detail";
import { RouteError } from "@/components/organisms/route-error";
import { usePullRefresh } from "@/hooks/use-pull-refresh";
import { useRecord } from "@/hooks/use-record";
import { useRecordAttachments } from "@/hooks/use-record-attachments";
import { useI18n } from "@/i18n/use-i18n";

export default function RecordPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { dict, locale } = useI18n();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: record, isPending, isError, refetch } = useRecord(id);
  const attachments = useRecordAttachments(id);
  const { refreshing, onRefresh } = usePullRefresh(async () => {
    await Promise.all([refetch(), attachments.refetch()]);
  });

  const refreshAttachments = () =>
    queryClient.invalidateQueries({
      queryKey: ["records", "attachments", id],
    });

  const body = () => {
    if (isPending) return <LoadingState />;
    if (isError) {
      return (
        <ErrorState dict={dict.errorPage} onRetry={() => void refetch()} />
      );
    }
    if (!record) {
      return (
        <EmptyState
          title={dict.notFound.title}
          description={dict.notFound.description}
        />
      );
    }
    return (
      <RecordDetail
        locale={locale}
        record={record}
        attachments={attachments.data ?? []}
        addAttachment={async (file) => {
          const result = await addAttachmentAction(id, file);
          await refreshAttachments();
          return result;
        }}
        deleteAttachment={async (attachmentId) => {
          const result = await deleteAttachmentAction(id, attachmentId);
          await refreshAttachments();
          return result;
        }}
        dict={dict}
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
    );
  };

  return (
    <View className="flex-1 bg-background">
      <PageTopBar
        backHref="/records"
        backLabel={dict.recordDetail.back}
        actions={
          record && (
            <>
              <Link href={`/records/${id}/edit` as Href} asChild>
                <Button
                  variant="outline"
                  size="sm"
                  icon={Pencil}
                  iconSize={18}
                  accessibilityRole="link"
                  accessibilityLabel={dict.recordDetail.edit}
                  className="px-2.5"
                />
              </Link>
              <DeleteRecordDialog
                onDelete={async () => {
                  const result = await deleteRecordAction(id);
                  if (result.success) {
                    await queryClient.invalidateQueries({
                      queryKey: ["records"],
                    });
                    router.dismissTo("/records");
                  }
                  return result;
                }}
                title={record.title}
                watchedAt={record.watchedAt}
                locale={locale}
                triggerLabel={dict.recordDetail.delete}
                dict={dict.deleteRecord}
              />
            </>
          )
        }
      />
      {body()}
    </View>
  );
}

export const ErrorBoundary = RouteError;
