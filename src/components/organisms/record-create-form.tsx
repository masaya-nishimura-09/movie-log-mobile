import { ArrowLeft, ArrowRight } from "lucide-react-native";
import { useEffect, useState } from "react";
import { KeyboardAvoidingView, ScrollView, View } from "react-native";
import { z } from "zod";
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
import type { RecordFieldErrors } from "@/lib/record/field-error";
import { toRecordInputValues } from "@/lib/record/record-form-state";
import { cn } from "@/lib/style/cn";
import { interpolate } from "@/lib/text/interpolate";
import type { RecordFormValues } from "@/schemas/record/record-form";
import { recordInputSchema } from "@/schemas/record/record-input";

type RecordCreateFormProps = {
  locale: Locale;
  values: RecordFormValues;
  maxReleaseYear: number;
  dict: Dictionary["recordForm"];
  enums: Dictionary["enums"];
  counterTemplate: string;
  closeLabel: string;
  onSaved: () => void;
};

const stepFields = [
  ["title", "watchedAt", "score", "platform"],
  [
    "releaseYear",
    "runtime",
    "language",
    "countries",
    "genres",
    "credits",
    "posterUrl",
  ],
  ["moodTags", "memo"],
];

function stepOf(field: string): number {
  const index = stepFields.findIndex((fields) => fields.includes(field));
  return index === -1 ? 0 : index;
}

export function RecordCreateForm({
  locale,
  values,
  maxReleaseYear,
  dict,
  enums,
  counterTemplate,
  closeLabel,
  onSaved,
}: RecordCreateFormProps) {
  const { form, update, selectMovie, searchMovies } = useRecordForm(
    values,
    locale,
  );
  const [step, setStep] = useState(0);
  const [stepErrors, setStepErrors] = useState<RecordFieldErrors>();
  const { mutate, data, isPending } = useSaveRecord(undefined, onSaved);
  const failure = data?.success === false ? data : undefined;
  const errors = stepErrors ?? failure?.errors;
  const steps = [dict.stepBasics, dict.stepMovieInfo, dict.stepImpression];

  useEffect(() => {
    const fields = Object.keys(failure?.errors ?? {});
    if (fields.length > 0) setStep(Math.min(...fields.map(stepOf)));
  }, [failure]);

  const goNext = () => {
    const result = recordInputSchema.safeParse(toRecordInputValues(form));
    const fieldErrors = result.success
      ? {}
      : z.flattenError(result.error).fieldErrors;
    const current = Object.fromEntries(
      Object.entries(fieldErrors).filter(([field]) =>
        stepFields[step]?.includes(field),
      ),
    );
    if (Object.keys(current).length > 0) {
      setStepErrors(current);
      return;
    }
    setStepErrors(undefined);
    setStep(step + 1);
  };

  const message =
    failure?.messageKey === "notFound"
      ? dict.notFound
      : failure?.messageKey === "invalidInput"
        ? dict.invalidInput
        : dict.unexpectedError;

  return (
    <KeyboardAvoidingView behavior="padding" className="flex-1">
      <View className="gap-3.5 bg-background px-4 pt-4 pb-3.5">
        <View className="flex-row gap-2">
          {steps.map((label, index) => (
            <View
              key={label}
              className={cn(
                "h-1 flex-1 rounded-full",
                index <= step ? "bg-selected-border" : "bg-input",
              )}
            />
          ))}
        </View>
        <Text className="text-foreground-sub text-xs">
          {interpolate(dict.stepProgress, {
            current: step + 1,
            total: steps.length,
          })}
          {` ・ ${steps[step]}`}
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-4 py-5.5"
        keyboardShouldPersistTaps="handled"
      >
        <View className="gap-4.5 rounded-[18px] bg-card p-4.5">
          {failure && <FormAlert>{message}</FormAlert>}
          {step === 0 && (
            <RecordBasicsFields
              locale={locale}
              closeLabel={closeLabel}
              form={form}
              update={update}
              searchMovies={searchMovies}
              onMovieSelect={selectMovie}
              errors={errors}
              dict={dict}
              enums={enums}
              counterTemplate={counterTemplate}
            />
          )}
          {step === 1 && (
            <>
              <View className="flex-row items-baseline gap-2">
                <Text className="font-bold text-base text-foreground">
                  {dict.stepMovieInfo}
                </Text>
                <Text className="text-muted-foreground text-xs">
                  {dict.movieInfoHint}
                </Text>
              </View>
              <RecordMovieFields
                locale={locale}
                form={form}
                update={update}
                errors={errors}
                maxReleaseYear={maxReleaseYear}
                uploadPoster={uploadPosterAction}
                dict={dict}
                enums={enums}
                closeLabel={closeLabel}
              />
            </>
          )}
          {step === 2 && (
            <>
              <View className="flex-row items-baseline gap-2">
                <Text className="font-bold text-base text-foreground">
                  {dict.impressionHeading}
                </Text>
                <Text className="text-muted-foreground text-xs">
                  {dict.optional}
                </Text>
              </View>
              <RecordImpressionFields
                form={form}
                update={update}
                errors={errors}
                dict={dict}
                enums={enums}
                counterTemplate={counterTemplate}
              />
            </>
          )}
        </View>
      </ScrollView>

      <View className="flex-row items-center gap-2 px-4 pt-3 pb-4">
        {step > 0 && (
          <Button
            variant="ghost"
            icon={ArrowLeft}
            onPress={() => setStep(step - 1)}
          >
            {dict.back}
          </Button>
        )}
        {step < steps.length - 1 ? (
          <Button className="h-12 flex-1" iconEnd={ArrowRight} onPress={goNext}>
            {dict.next}
          </Button>
        ) : (
          <Button
            className="h-12 flex-1"
            disabled={isPending}
            onPress={() => mutate(toRecordInputValues(form))}
          >
            {dict.save}
          </Button>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}
