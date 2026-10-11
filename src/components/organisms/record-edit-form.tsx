import { useRouter } from "expo-router";
import type { ReactNode } from "react";
import { KeyboardAvoidingView, ScrollView, View } from "react-native";
import { uploadPosterAction } from "@/actions/media/upload-poster";
import { Button } from "@/components/atoms/button";
import { Text } from "@/components/atoms/text";
import { FormAlert } from "@/components/molecules/form-alert";
import { RecordBasicsFields } from "@/components/organisms/record-basics-fields";
import { RecordImpressionFields } from "@/components/organisms/record-impression-fields";
import { RecordMovieFields } from "@/components/organisms/record-movie-fields";
import { useRecordForm } from "@/hooks/use-record-form";
import { useSaveRecord } from "@/hooks/use-save-record";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/locales";
import { toRecordInputValues } from "@/lib/record/record-form-state";
import type { RecordFormValues } from "@/schemas/record/record-form";

type RecordEditFormProps = {
  recordId: string;
  locale: Locale;
  values: RecordFormValues;
  maxReleaseYear: number;
  dict: Dictionary["recordForm"];
  enums: Dictionary["enums"];
  counterTemplate: string;
  closeLabel: string;
};

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View className="gap-4.5 rounded-[18px] bg-card p-4.5">
      <Text className="font-bold text-base text-foreground">{title}</Text>
      {children}
    </View>
  );
}

export function RecordEditForm({
  recordId,
  locale,
  values,
  maxReleaseYear,
  dict,
  enums,
  counterTemplate,
  closeLabel,
}: RecordEditFormProps) {
  const router = useRouter();
  const { form, update, selectMovie, searchMovies } = useRecordForm(
    values,
    locale,
  );
  const { mutate, data, isPending } = useSaveRecord(recordId);
  const failure = data?.success === false ? data : undefined;
  const message =
    failure?.messageKey === "notFound"
      ? dict.notFound
      : failure?.messageKey === "invalidInput"
        ? dict.invalidInput
        : dict.unexpectedError;

  return (
    <KeyboardAvoidingView behavior="padding" className="flex-1">
      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-4 px-4 pt-5 pb-6"
        keyboardShouldPersistTaps="handled"
      >
        {failure && <FormAlert>{message}</FormAlert>}
        <Panel title={dict.watchSection}>
          <RecordBasicsFields
            locale={locale}
            closeLabel={closeLabel}
            form={form}
            update={update}
            searchMovies={searchMovies}
            onMovieSelect={selectMovie}
            errors={failure?.errors}
            dict={dict}
            enums={enums}
            counterTemplate={counterTemplate}
          />
        </Panel>
        <Panel title={dict.stepImpression}>
          <RecordImpressionFields
            form={form}
            update={update}
            errors={failure?.errors}
            dict={dict}
            enums={enums}
            counterTemplate={counterTemplate}
          />
        </Panel>
        <Panel title={dict.movieSection}>
          <RecordMovieFields
            locale={locale}
            form={form}
            update={update}
            errors={failure?.errors}
            maxReleaseYear={maxReleaseYear}
            uploadPoster={uploadPosterAction}
            dict={dict}
            enums={enums}
            closeLabel={closeLabel}
          />
        </Panel>
      </ScrollView>
      <View className="flex-row items-center justify-end gap-2 px-4 pt-3 pb-4">
        <Button variant="outline" onPress={() => router.back()}>
          {dict.cancel}
        </Button>
        <Button
          disabled={isPending}
          onPress={() => mutate(toRecordInputValues(form))}
        >
          {dict.saveChanges}
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}
