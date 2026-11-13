import { useLocalSearchParams } from "expo-router";
import { View } from "react-native";
import { EmptyState } from "@/components/molecules/empty-state";
import { ErrorState } from "@/components/molecules/error-state";
import { LoadingState } from "@/components/molecules/loading-state";
import { PageTopBar } from "@/components/organisms/page-top-bar";
import { RecordEditForm } from "@/components/organisms/record-edit-form";
import { RouteError } from "@/components/organisms/route-error";
import { useRecord } from "@/hooks/use-record";
import { useRecordAttachments } from "@/hooks/use-record-attachments";
import { useI18n } from "@/i18n/use-i18n";
import { maxReleaseYear, toFormValues } from "@/lib/record/to-form-values";

export default function EditRecordPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { dict, locale } = useI18n();
  const record = useRecord(id);
  const attachments = useRecordAttachments(id);

  const body = () => {
    if (record.isPending || attachments.isPending) return <LoadingState />;
    if (record.isError || attachments.isError) {
      return (
        <ErrorState
          dict={dict.errorPage}
          onRetry={() => {
            void record.refetch();
            void attachments.refetch();
          }}
        />
      );
    }
    if (!record.data) {
      return (
        <EmptyState
          title={dict.notFound.title}
          description={dict.notFound.description}
        />
      );
    }
    return (
      <RecordEditForm
        recordId={id}
        locale={locale}
        values={toFormValues(record.data)}
        attachments={attachments.data}
        maxReleaseYear={maxReleaseYear(new Date())}
        dict={dict.recordForm}
        enums={dict.enums}
        counterTemplate={dict.characterCount}
        editorDict={dict.noteEditor}
        closeLabel={dict.header.close}
      />
    );
  };

  return (
    <View className="flex-1 bg-background">
      <PageTopBar
        backHref={`/records/${id}`}
        backLabel={dict.recordForm.back}
        title={dict.recordForm.editTitle}
      />
      {body()}
    </View>
  );
}

export const ErrorBoundary = RouteError;
