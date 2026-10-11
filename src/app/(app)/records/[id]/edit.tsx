import { useLocalSearchParams } from "expo-router";
import { View } from "react-native";
import { EmptyState } from "@/components/molecules/empty-state";
import { ErrorState } from "@/components/molecules/error-state";
import { LoadingState } from "@/components/molecules/loading-state";
import { PageTopBar } from "@/components/organisms/page-top-bar";
import { RecordEditForm } from "@/components/organisms/record-edit-form";
import { useRecord } from "@/hooks/use-record";
import { useI18n } from "@/i18n/use-i18n";
import { maxReleaseYear, toFormValues } from "@/lib/record/to-form-values";

export default function EditRecordPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { dict, locale } = useI18n();
  const { data: record, isPending, isError, refetch } = useRecord(id);

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
      <RecordEditForm
        recordId={id}
        locale={locale}
        values={toFormValues(record)}
        maxReleaseYear={maxReleaseYear(new Date())}
        dict={dict.recordForm}
        enums={dict.enums}
        counterTemplate={dict.characterCount}
        closeLabel={dict.recordForm.back}
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
