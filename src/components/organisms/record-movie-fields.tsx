import { View } from "react-native";
import type { ActionResult } from "@/actions/action-result";
import type { PosterFile } from "@/api/media/upload-poster";
import { ChoiceChip } from "@/components/atoms/choice-chip";
import { Input } from "@/components/atoms/input";
import { Text } from "@/components/atoms/text";
import { CountryInput } from "@/components/molecules/country-input";
import { CreditRows } from "@/components/molecules/credit-rows";
import { FormField } from "@/components/molecules/form-field";
import { PosterUrlField } from "@/components/molecules/poster-url-field";
import { Select } from "@/components/molecules/select";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/locales";
import { fieldError, type RecordFieldErrors } from "@/lib/record/field-error";
import { buildLanguageOptions } from "@/lib/record/language-options";
import type { RecordFormState } from "@/lib/record/record-form-state";
import { interpolate } from "@/lib/text/interpolate";
import { genreSchema } from "@/schemas/record/enums";

type RecordMovieFieldsProps = {
  locale: Locale;
  form: RecordFormState;
  update: (patch: Partial<RecordFormState>) => void;
  errors?: RecordFieldErrors;
  maxReleaseYear: number;
  uploadPoster: (
    file: PosterFile & { size?: number },
  ) => Promise<ActionResult<string>>;
  dict: Dictionary["recordForm"];
  enums: Dictionary["enums"];
  closeLabel: string;
};

export function RecordMovieFields({
  locale,
  form,
  update,
  errors,
  maxReleaseYear,
  uploadPoster,
  dict,
  enums,
  closeLabel,
}: RecordMovieFieldsProps) {
  const languageOptions = buildLanguageOptions(
    locale,
    form.language,
    dict.languageUnknown,
  );

  return (
    <View className="gap-4.5">
      <View className="flex-row gap-4">
        <FormField
          label={dict.releaseYear}
          error={fieldError(errors, dict, "releaseYear")}
          required
          hint={interpolate(dict.releaseYearHint, { max: maxReleaseYear })}
          className="flex-1"
        >
          <Input
            value={form.releaseYear}
            onChangeText={(releaseYear) => update({ releaseYear })}
            keyboardType="number-pad"
            maxLength={4}
            invalid={Boolean(errors?.releaseYear)}
          />
        </FormField>
        <FormField
          label={dict.runtime}
          error={fieldError(errors, dict, "runtime")}
          hint={dict.runtimeHint}
          className="flex-1"
        >
          <View className="relative">
            <Input
              value={form.runtime}
              onChangeText={(runtime) => update({ runtime })}
              keyboardType="number-pad"
              maxLength={4}
              className="pr-10"
              invalid={Boolean(errors?.runtime)}
            />
            <View
              pointerEvents="none"
              className="absolute inset-y-0 right-3 justify-center"
            >
              <Text className="text-muted-foreground text-sm">
                {dict.runtimeUnit}
              </Text>
            </View>
          </View>
        </FormField>
      </View>

      <FormField
        label={dict.language}
        error={fieldError(errors, dict, "language")}
        required
        hint={dict.languageHint}
      >
        <Select
          items={languageOptions}
          value={form.language}
          onValueChange={(language) => update({ language })}
          label={dict.language}
          closeLabel={closeLabel}
        />
      </FormField>

      <FormField
        label={dict.countries}
        error={fieldError(errors, dict, "countries")}
      >
        <CountryInput
          locale={locale}
          codes={form.countries}
          onChange={(countries) => update({ countries })}
          placeholder={dict.countriesPlaceholder}
          removeTemplate={dict.removeCountry}
        />
      </FormField>

      <FormField
        label={dict.genres}
        error={fieldError(errors, dict, "genres")}
        hint={dict.genresHint}
      >
        <View className="flex-row flex-wrap gap-1.75">
          {genreSchema.options.map((genre) => (
            <ChoiceChip
              key={genre}
              shape="square"
              size="sm"
              tone="genre"
              labelClassName="text-[13px]"
              active={form.genres.includes(genre)}
              onPress={() =>
                update({
                  genres: form.genres.includes(genre)
                    ? form.genres.filter((g) => g !== genre)
                    : [...form.genres, genre],
                })
              }
            >
              {enums.genre[genre]}
            </ChoiceChip>
          ))}
        </View>
      </FormField>

      <FormField
        label={dict.credits}
        error={fieldError(errors, dict, "credits")}
        hint={dict.creditsHint}
      >
        <CreditRows
          rows={form.credits}
          onChange={(credits) => update({ credits })}
          roleLabels={enums.creditRole}
          roleLabel={dict.creditRole}
          namePlaceholder={dict.personName}
          addLabel={dict.addCredit}
          removeLabel={dict.removeCredit}
          closeLabel={closeLabel}
        />
      </FormField>

      <FormField
        label={dict.posterUrl}
        error={fieldError(errors, dict, "posterUrl")}
      >
        <PosterUrlField
          value={form.posterUrl}
          onValueChange={(posterUrl) => update({ posterUrl })}
          placeholder={dict.posterUrlPlaceholder}
          upload={uploadPoster}
          uploadLabel={dict.uploadPoster}
          uploadingLabel={dict.uploadingPoster}
          errorLabel={dict.posterUploadError}
          invalid={Boolean(errors?.posterUrl)}
        />
      </FormField>
    </View>
  );
}
