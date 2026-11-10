import { View } from "react-native";
import { ChoiceChip } from "@/components/atoms/choice-chip";
import { FormField } from "@/components/molecules/form-field";
import { NoteEditor } from "@/components/molecules/note-editor";
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
  editorDict: Dictionary["noteEditor"];
};

export function RecordImpressionFields({
  form,
  update,
  errors,
  dict,
  enums,
  editorDict,
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

      <FormField label={dict.note} error={fieldError(errors, dict, "note")}>
        <NoteEditor
          defaultValue={form.note}
          onChange={(note) => update({ note })}
          dict={editorDict}
          invalid={Boolean(errors?.note)}
        />
      </FormField>
    </View>
  );
}
