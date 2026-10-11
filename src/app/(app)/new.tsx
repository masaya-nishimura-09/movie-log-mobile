import { useState } from "react";
import { View } from "react-native";
import { Inset } from "@/components/atoms/inset";
import { PageTopBar } from "@/components/organisms/page-top-bar";
import { RecordCreateForm } from "@/components/organisms/record-create-form";
import { useI18n } from "@/i18n/use-i18n";
import { emptyFormValues, maxReleaseYear } from "@/lib/record/to-form-values";

export default function NewRecordPage() {
  const { dict, locale } = useI18n();
  const [formKey, setFormKey] = useState(0);

  return (
    <Inset>
      <View className="flex-1 bg-background">
        <PageTopBar title={dict.recordForm.createTitle} />
        <RecordCreateForm
          key={formKey}
          locale={locale}
          values={emptyFormValues()}
          maxReleaseYear={maxReleaseYear(new Date())}
          dict={dict.recordForm}
          enums={dict.enums}
          counterTemplate={dict.characterCount}
          closeLabel={dict.recordForm.back}
          onSaved={() => setFormKey((key) => key + 1)}
        />
      </View>
    </Inset>
  );
}
