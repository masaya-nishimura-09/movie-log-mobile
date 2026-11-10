import { useState } from "react";
import { View } from "react-native";
import { Inset } from "@/components/atoms/inset";
import { Text } from "@/components/atoms/text";
import { RecordCreateForm } from "@/components/organisms/record-create-form";
import { useI18n } from "@/i18n/use-i18n";
import { emptyFormValues, maxReleaseYear } from "@/lib/record/to-form-values";

export default function NewRecordPage() {
  const { dict, locale } = useI18n();
  const [formKey, setFormKey] = useState(0);

  return (
    <Inset>
      <View className="flex-1 bg-background">
        <Text
          accessibilityRole="header"
          className="px-4 pt-5 font-bold text-2xl text-foreground"
        >
          {dict.recordForm.createTitle}
        </Text>
        <RecordCreateForm
          key={formKey}
          locale={locale}
          values={emptyFormValues()}
          maxReleaseYear={maxReleaseYear(new Date())}
          dict={dict.recordForm}
          enums={dict.enums}
          counterTemplate={dict.characterCount}
          editorDict={dict.noteEditor}
          closeLabel={dict.recordForm.back}
          onSaved={() => setFormKey((key) => key + 1)}
        />
      </View>
    </Inset>
  );
}
