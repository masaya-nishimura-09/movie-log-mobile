import { View } from "react-native";
import { ChoiceChip } from "@/components/atoms/choice-chip";
import { DatePickerField } from "@/components/molecules/date-picker-field";
import { FormField } from "@/components/molecules/form-field";
import { MovieTitleField } from "@/components/molecules/movie-title-field";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/locales";
import { toDateInputValue } from "@/lib/date/format-date";
import { fieldError, type RecordFieldErrors } from "@/lib/record/field-error";
import type { RecordFormState } from "@/lib/record/record-form-state";
import type { MovieSuggestion } from "@/schemas/movie/movie";
import { platformSchema, scores } from "@/schemas/record/enums";

type RecordBasicsFieldsProps = {
  locale: Locale;
  closeLabel: string;
  form: RecordFormState;
  update: (patch: Partial<RecordFormState>) => void;
  searchMovies: (title: string) => Promise<MovieSuggestion[]>;
  onMovieSelect: (movieId: string) => void;
  errors?: RecordFieldErrors;
  dict: Dictionary["recordForm"];
  enums: Dictionary["enums"];
  counterTemplate: string;
};

function daysAgo(days: number) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return toDateInputValue(date);
}

export function RecordBasicsFields({
  locale,
  closeLabel,
  form,
  update,
  searchMovies,
  onMovieSelect,
  errors,
  dict,
  enums,
  counterTemplate,
}: RecordBasicsFieldsProps) {
  const quickDates = [
    { label: dict.today, value: daysAgo(0) },
    { label: dict.yesterday, value: daysAgo(1) },
  ];

  return (
    <View className="gap-4.5">
      <FormField
        label={dict.title}
        error={fieldError(errors, dict, "title")}
        hint={dict.titleHint}
        required
      >
        <MovieTitleField
          value={form.title}
          onValueChange={(title) => update({ title })}
          search={searchMovies}
          onSelect={onMovieSelect}
          maxLength={255}
          counterTemplate={counterTemplate}
          invalid={Boolean(errors?.title)}
        />
      </FormField>

      <FormField
        label={dict.watchedAt}
        error={fieldError(errors, dict, "watchedAt")}
        required
      >
        <DatePickerField
          value={form.watchedAt}
          onValueChange={(watchedAt) => update({ watchedAt })}
          locale={locale}
          label={dict.watchedAt}
          closeLabel={closeLabel}
        />
        <View className="mt-0.75 flex-row gap-1.5">
          {quickDates.map((quick) => (
            <ChoiceChip
              key={quick.label}
              size="sm"
              tone="field"
              active={form.watchedAt === quick.value}
              onPress={() => update({ watchedAt: quick.value })}
            >
              {quick.label}
            </ChoiceChip>
          ))}
        </View>
      </FormField>

      <FormField
        label={dict.score}
        error={fieldError(errors, dict, "score")}
        required
        hint={dict.scoreHint}
      >
        <View className="flex-row gap-1.75">
          {[...scores].reverse().map((score) => (
            <ChoiceChip
              key={score}
              shape="block"
              size="lg"
              tone="field"
              active={form.score === score}
              onPress={() => update({ score })}
              className="h-13 min-w-0 px-0"
            >
              {String(score)}
            </ChoiceChip>
          ))}
        </View>
      </FormField>

      <FormField
        label={dict.platform}
        error={fieldError(errors, dict, "platform")}
        required
      >
        <View className="flex-row flex-wrap gap-1.75">
          {platformSchema.options.map((platform) => (
            <ChoiceChip
              key={platform}
              active={form.platform === platform}
              onPress={() => update({ platform })}
              className="h-10"
            >
              {enums.platform[platform]}
            </ChoiceChip>
          ))}
        </View>
      </FormField>
    </View>
  );
}
