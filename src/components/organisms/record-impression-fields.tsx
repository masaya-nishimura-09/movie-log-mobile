import { View } from "react-native";
import { ChoiceChip } from "@/components/atoms/choice-chip";
import { CountedTextarea } from "@/components/molecules/counted-textarea";
import { FormField } from "@/components/molecules/form-field";
import type { Dictionary } from "@/i18n/get-dictionary";
import { fieldError, type RecordFieldErrors } from "@/lib/record/field-error";
import type { RecordFormState } from "@/lib/record/record-form-state";
import { moodTagSchema } from "@/schemas/record/enums";

type RecordImpressionFieldsProps = {
  form: RecordFormState;
  update: (patch: Partial<RecordFormState>) => void;
  errors?: RecordFieldErrors;
  dict: Dictionary["recordForm"];
  enums: Dictionary["enums"];
  counterTemplate: string;
};

export function RecordImpressionFields({
  form,
  update,
  errors,
  dict,
  enums,
  counterTemplate,
}: RecordImpressionFieldsProps) {
  return (
    <View className="gap-4.5">
      <FormField
        label={dict.moodTags}
        error={fieldError(errors, dict, "moodTags")}
        hint={dict.moodTagsHint}
      >
        <View className="flex-row flex-wrap gap-1.75">
          {moodTagSchema.options.map((mood) => (
            <ChoiceChip
              key={mood}
              size="sm"
              tone="mood"
              labelClassName="text-[13px]"
              active={form.moodTags.includes(mood)}
              onPress={() =>
                update({
                  moodTags: form.moodTags.includes(mood)
                    ? form.moodTags.filter((m) => m !== mood)
                    : [...form.moodTags, mood],
                })
              }
            >
              {enums.moodTag[mood]}
            </ChoiceChip>
          ))}
        </View>
      </FormField>

      <FormField label={dict.memo} error={fieldError(errors, dict, "memo")}>
        <CountedTextarea
          value={form.memo}
          onChangeText={(memo) => update({ memo })}
          maxLength={1000}
          counterTemplate={counterTemplate}
          invalid={Boolean(errors?.memo)}
        />
      </FormField>
    </View>
  );
}
